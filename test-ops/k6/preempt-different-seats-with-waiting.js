import encoding from "k6/encoding";
import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Trend } from "k6/metrics";
import { SharedArray } from "k6/data";

const API_BASE_URL = __ENV.API_BASE_URL || "http://localhost:8080";
const WAITING_API_BASE_URL = __ENV.WAITING_API_BASE_URL || "http://localhost:8081";
const CONCERT_ID = Number(__ENV.CONCERT_ID || 1);
const SCHEDULE_ID = Number(__ENV.SCHEDULE_ID || 1);
const ACCOUNT_LIMIT = Number(__ENV.ACCOUNT_LIMIT || 500);
const LOGIN_BATCH_SIZE = Number(__ENV.LOGIN_BATCH_SIZE || 50);
const WAITING_TIMEOUT_SECONDS = Number(__ENV.WAITING_TIMEOUT_SECONDS || 120);
const WAITING_POLL_INTERVAL_SECONDS = Number(__ENV.WAITING_POLL_INTERVAL_SECONDS || 2);
const MAX_DURATION = __ENV.MAX_DURATION || `${WAITING_TIMEOUT_SECONDS + 60}s`;

const waitingActive = new Counter("waiting_active");
const waitingTimeout = new Counter("waiting_timeout");
const seatLoadUnauthorized = new Counter("seat_load_unauthorized");
const seatLoadFailed = new Counter("seat_load_failed");
const authCheckSuccess = new Counter("auth_check_success");
const authCheckFailed = new Counter("auth_check_failed");
const preemptSuccess = new Counter("preempt_success");
const preemptFailed = new Counter("preempt_failed");
const reservationSuccess = new Counter("reservation_success");
const reservationFailed = new Counter("reservation_failed");
const waitingDuration = new Trend("waiting_duration");

const accounts = new SharedArray("accounts", () => {
  const data = JSON.parse(open("../testdata/smu8-ticket-accounts-500.json"));
  return data.accounts.slice(0, ACCOUNT_LIMIT);
});

export const options = {
  setupTimeout: "5m",
  scenarios: {
    waiting_then_preempt_different_seats: {
      executor: "per-vu-iterations",
      vus: ACCOUNT_LIMIT,
      iterations: 1,
      maxDuration: MAX_DURATION,
    },
  },
  thresholds: {
    waiting_timeout: ["count==0"],
    seat_load_unauthorized: ["count==0"],
    seat_load_failed: ["count==0"],
    auth_check_failed: ["count==0"],
    preempt_success: [`count==${ACCOUNT_LIMIT}`],
    preempt_failed: ["count==0"],
    reservation_success: [`count==${ACCOUNT_LIMIT}`],
    reservation_failed: ["count==0"],
    checks: ["rate>0.99"],
  },
};

function basicAuth(username, password) {
  return `Basic ${encoding.b64encode(`${username}:${password}`)}`;
}

function bearerHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

function jsonBearerHeaders(token) {
  return {
    "Content-Type": "application/json",
    ...bearerHeaders(token),
  };
}

function loginAll(targetAccounts) {
  const tokens = [];

  for (let start = 0; start < targetAccounts.length; start += LOGIN_BATCH_SIZE) {
    const batchAccounts = targetAccounts.slice(start, start + LOGIN_BATCH_SIZE);
    const requests = batchAccounts.map((account) => [
      "POST",
      `${API_BASE_URL}/api/token`,
      null,
      {
        headers: {
          Authorization: basicAuth(account.username, account.password),
        },
        tags: {
          name: "POST /api/token setup login",
        },
      },
    ]);

    const responses = http.batch(requests);

    responses.forEach((response, index) => {
      const account = batchAccounts[index];

      if (response.status !== 200) {
        throw new Error(`로그인 실패: ${account.username}, status=${response.status}, body=${response.body}`);
      }

      const tokenValue = response.json("tokenValue");

      if (!tokenValue) {
        throw new Error(`토큰이 응답에 없습니다: ${account.username}`);
      }

      tokens.push(tokenValue);
    });
  }

  return tokens;
}

function loadSeatIdForVu(token, vuIndex) {
  if (!token) {
    seatLoadUnauthorized.add(1);
    throw new Error(`좌석 조회용 토큰이 없습니다. vu=${__VU}, vuIndex=${vuIndex}`);
  }

  const response = http.get(
    `${API_BASE_URL}/api/reservations/preempt-seats?concertId=${CONCERT_ID}&scheduleId=${SCHEDULE_ID}`,
    {
      headers: bearerHeaders(token),
      tags: {
        name: "GET /api/reservations/preempt-seats setup",
      },
    },
  );

  if (response.status !== 200) {
    if (response.status === 401) {
      seatLoadUnauthorized.add(1);
      checkTicketAuth(token);
    } else {
      seatLoadFailed.add(1);
    }

    return null;
  }

  const seats = response.json("seats") || [];
  const orderedSeats = seats
    .filter((seatStatus) => seatStatus.seat && seatStatus.seat.id)
    .sort((left, right) => left.seat.id - right.seat.id);

  if (orderedSeats.length < accounts.length) {
    seatLoadFailed.add(1);
    throw new Error(
      `좌석이 부족합니다. 필요=${accounts.length}, 전체=${orderedSeats.length}`,
    );
  }

  const selectedSeat = orderedSeats[vuIndex];

  if (!selectedSeat) {
    seatLoadFailed.add(1);
    throw new Error(`VU에 배정할 좌석이 없습니다. vuIndex=${vuIndex}, 전체=${orderedSeats.length}`);
  }

  if (selectedSeat.status !== "AVAILABLE") {
    seatLoadFailed.add(1);
    throw new Error(
      `배정 좌석이 사용 가능 상태가 아닙니다. seatId=${selectedSeat.seat.id}, status=${selectedSeat.status}`,
    );
  }

  return selectedSeat.seat.id;
}

function checkTicketAuth(token) {
  const response = http.get(`${API_BASE_URL}/api/account/me`, {
    headers: bearerHeaders(token),
    tags: {
      name: "GET /api/account/me auth diagnostic",
    },
  });

  if (response.status === 200) {
    authCheckSuccess.add(1);
    return true;
  }

  authCheckFailed.add(1);
  return false;
}

function enterWaitingQueue(token) {
  return http.post(
    `${WAITING_API_BASE_URL}/api/waiting/concerts/${CONCERT_ID}/queue`,
    null,
    {
      headers: jsonBearerHeaders(token),
      tags: {
        name: "POST /api/waiting/concerts/:concertId/queue",
      },
    },
  );
}

function getWaitingQueueStatus(token) {
  return http.get(
    `${WAITING_API_BASE_URL}/api/waiting/concerts/${CONCERT_ID}/queue`,
    {
      headers: bearerHeaders(token),
      tags: {
        name: "GET /api/waiting/concerts/:concertId/queue",
      },
    },
  );
}

function waitUntilActive(token) {
  const startedAt = Date.now();
  let lastRank = null;
  let lastWaitingCount = null;

  while ((Date.now() - startedAt) / 1000 < WAITING_TIMEOUT_SECONDS) {
    const response = getWaitingQueueStatus(token);

    if (response.status !== 200) {
      throw new Error(`대기열 상태 조회 실패: status=${response.status}, body=${response.body}`);
    }

    const active = response.json("active");
    lastRank = response.json("rank");
    lastWaitingCount = response.json("waitingCount");

    if (active) {
      waitingActive.add(1);
      waitingDuration.add(Date.now() - startedAt);
      return {
        active: true,
        rank: lastRank,
        waitingCount: lastWaitingCount,
      };
    }

    sleep(WAITING_POLL_INTERVAL_SECONDS);
  }

  waitingTimeout.add(1);
  waitingDuration.add(Date.now() - startedAt);

  return {
    active: false,
    rank: lastRank,
    waitingCount: lastWaitingCount,
  };
}

export function setup() {
  const tokens = loginAll(accounts);

  return {
    cases: accounts.map((account, index) => ({
      username: account.username,
      token: tokens[index],
    })),
  };
}

export default function (data) {
  const testCase = data.cases[__VU - 1];

  const enterResponse = enterWaitingQueue(testCase.token);

  check(enterResponse, {
    "대기열 입장 요청 성공": (r) => r.status === 200,
  });

  if (enterResponse.status !== 200) {
    waitingTimeout.add(1);
    throw new Error(`대기열 입장 실패: username=${testCase.username}, status=${enterResponse.status}, body=${enterResponse.body}`);
  }

  if (enterResponse.json("active")) {
    waitingActive.add(1);
    waitingDuration.add(0);
  } else {
    const waitingResult = waitUntilActive(testCase.token);

    check(waitingResult, {
      "대기열 통과": (result) => result.active,
    });

    if (!waitingResult.active) {
      return;
    }
  }

  const seatId = loadSeatIdForVu(testCase.token, __VU - 1);

  check(seatId, {
    "대기열 통과 후 좌석 조회 성공": (id) => id !== null,
  });

  if (seatId === null) {
    return;
  }

  const requestBody = JSON.stringify({
    concertId: CONCERT_ID,
    scheduleId: SCHEDULE_ID,
    seatIds: [seatId],
  });

  const preemptResponse = http.post(
    `${API_BASE_URL}/api/reservations/preempt-seats`,
    requestBody,
    {
      headers: jsonBearerHeaders(testCase.token),
      tags: {
        name: "POST /api/reservations/preempt-seats after waiting",
      },
    },
  );

  const preempted = check(preemptResponse, {
    "대기열 통과 후 선점 요청 성공": (r) => r.status === 200,
  });

  if (!preempted) {
    preemptFailed.add(1);
    return;
  }

  preemptSuccess.add(1);

  const reservationResponse = http.post(
    `${API_BASE_URL}/api/reservations`,
    requestBody,
    {
      headers: jsonBearerHeaders(testCase.token),
      tags: {
        name: "POST /api/reservations after waiting",
      },
    },
  );

  const reserved = check(reservationResponse, {
    "대기열 통과 후 예매 요청 성공": (r) => r.status === 200,
  });

  if (reserved) {
    reservationSuccess.add(1);
    return;
  }

  reservationFailed.add(1);
}
