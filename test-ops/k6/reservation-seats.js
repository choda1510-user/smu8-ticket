import encoding from "k6/encoding";
import http from "k6/http";
import { check } from "k6";
import { Counter } from "k6/metrics";
import { SharedArray } from "k6/data";

const API_BASE_URL = __ENV.API_BASE_URL || "http://localhost:8080";
const CONCERT_ID = Number(__ENV.CONCERT_ID || 1);
const SCHEDULE_ID = Number(__ENV.SCHEDULE_ID || 1);
const ACCOUNT_LIMIT = Number(__ENV.ACCOUNT_LIMIT || 500);
const LOGIN_BATCH_SIZE = Number(__ENV.LOGIN_BATCH_SIZE || 50);

const preemptSuccess = new Counter("preempt_success");
const preemptFailed = new Counter("preempt_failed");
const reservationSuccess = new Counter("reservation_success");
const reservationFailed = new Counter("reservation_failed");

const accounts = new SharedArray("accounts", () => {
  const data = JSON.parse(open("../testdata/output/smu8-ticket-accounts.json"));
  return data.accounts.slice(0, ACCOUNT_LIMIT);
});

export const options = {
  setupTimeout: "5m",
  scenarios: {
    preempt_different_seats: {
      executor: "per-vu-iterations",
      vus: accounts.length,
      iterations: 1,
      maxDuration: "1m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1000"],
    preempt_success: [`count==${accounts.length}`],
    preempt_failed: ["count==0"],
    reservation_success: [`count==${accounts.length}`],
    reservation_failed: ["count==0"],
    checks: ["rate>0.99"],
  },
};

function login(account) {
  const basicToken = encoding.b64encode(`${account.username}:${account.password}`);

  const response = http.post(`${API_BASE_URL}/api/token`, null, {
    headers: {
      Authorization: `Basic ${basicToken}`,
    },
  });

  if (response.status !== 200) {
    throw new Error(`로그인 실패: ${account.username}, status=${response.status}, body=${response.body}`);
  }

  const tokenValue = response.json("tokenValue");

  if (!tokenValue) {
    throw new Error(`토큰이 응답에 없습니다: ${account.username}`);
  }

  return tokenValue;
}

function loginAll(targetAccounts) {
  const tokens = [];

  for (let start = 0; start < targetAccounts.length; start += LOGIN_BATCH_SIZE) {
    const batchAccounts = targetAccounts.slice(start, start + LOGIN_BATCH_SIZE);
    const requests = batchAccounts.map((account) => {
      const basicToken = encoding.b64encode(`${account.username}:${account.password}`);

      return [
        "POST",
        `${API_BASE_URL}/api/token`,
        null,
        {
          headers: {
            Authorization: `Basic ${basicToken}`,
          },
          tags: {
            name: "POST /api/token setup login",
          },
        },
      ];
    });

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

function loadAvailableSeatIds(token) {
  const response = http.get(
    `${API_BASE_URL}/api/reservations/preempt-seats?concertId=${CONCERT_ID}&scheduleId=${SCHEDULE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error(`좌석 조회 실패: status=${response.status}, body=${response.body}`);
  }

  const seats = response.json("seats") || [];
  const availableSeatIds = seats
    .filter((seatStatus) => seatStatus.status === "AVAILABLE")
    .map((seatStatus) => seatStatus.seat.id);

  if (availableSeatIds.length < accounts.length) {
    throw new Error(
      `사용 가능한 좌석이 부족합니다. 필요=${accounts.length}, 가능=${availableSeatIds.length}`,
    );
  }

  return availableSeatIds.slice(0, accounts.length);
}

function jsonBearerHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function setup() {
  const tokens = loginAll(accounts);
  const seatIds = loadAvailableSeatIds(tokens[0]);

  return {
    cases: accounts.map((account, index) => ({
      username: account.username,
      token: tokens[index],
      seatId: seatIds[index],
    })),
  };
}

export default function (data) {
  const testCase = data.cases[__VU - 1];

  const requestBody = JSON.stringify({
    concertId: CONCERT_ID,
    scheduleId: SCHEDULE_ID,
    seatIds: [testCase.seatId],
  });

  const preemptResponse = http.post(
    `${API_BASE_URL}/api/reservations/preempt-seats`,
    requestBody,
    {
      headers: jsonBearerHeaders(testCase.token),
      tags: {
        name: "POST /api/reservations/preempt-seats different seats",
      },
    },
  );

  const preempted = check(preemptResponse, {
    "선점 요청 성공": (r) => r.status === 200,
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
        name: "POST /api/reservations different seats",
      },
    },
  );

  const reserved = check(reservationResponse, {
    "예매 요청 성공": (r) => r.status === 200,
  });

  if (reserved) {
    reservationSuccess.add(1);
    return;
  }

  reservationFailed.add(1);
}
