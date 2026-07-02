import http from "k6/http";
import encoding from "k6/encoding";
import { Counter } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:8080";
const VUS = Number(__ENV.VUS || 100);
const CONCERT_ID = Number(__ENV.CONCERT_ID || 1);
const SCHEDULE_ID = Number(__ENV.SCHEDULE_ID || 1);
const SEAT_ID = Number(__ENV.SEAT_ID || 1);
const PASSWORD = __ENV.PASSWORD || "password1234";
const USERNAME_PREFIX = __ENV.USERNAME_PREFIX || "smu8_user_";
const NICKNAME_PREFIX = __ENV.NICKNAME_PREFIX || "smu8_nickname_";
const USERNAME_PAD = Number(__ENV.USERNAME_PAD || 4);
const ACCOUNTS_FILE = __ENV.ACCOUNTS_FILE || "";
const CREATE_USERS = (__ENV.CREATE_USERS || "false").toLowerCase() === "true";
const ACCOUNTS = loadAccounts();

const preemptSuccess = new Counter("preempt_success");
const preemptRejected = new Counter("preempt_rejected");
const preemptUnexpected = new Counter("preempt_unexpected");

export const options = {
  scenarios: {
    same_seat_preempt: {
      executor: "per-vu-iterations",
      vus: VUS,
      iterations: 1,
      maxDuration: "1m",
    },
  },
  thresholds: {
    preempt_success: ["count==1"],
    preempt_rejected: [`count==${VUS - 1}`],
    preempt_unexpected: ["count==0"],
  },
};

function basicAuth(username, password) {
  return `Basic ${encoding.b64encode(`${username}:${password}`)}`;
}

function jsonHeaders(extraHeaders = {}) {
  return {
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  };
}

function loadAccounts() {
  if (!ACCOUNTS_FILE) {
    return [];
  }

  const content = open(ACCOUNTS_FILE).trim();
  if (!content) {
    return [];
  }

  const parsed = JSON.parse(content);
  const accounts = Array.isArray(parsed) ? parsed : parsed.accounts;

  if (!Array.isArray(accounts)) {
    throw new Error("ACCOUNTS_FILE must be a JSON array or an object with an accounts array.");
  }

  return accounts.map((account, index) => ({
    username: account.username || account.loginId || account.userId || account.id,
    password: account.password || PASSWORD,
    nickname: account.nickname || `${NICKNAME_PREFIX}${index + 1}`,
  }));
}

function accountAt(index) {
  if (ACCOUNTS.length > 0) {
    return ACCOUNTS[index];
  }

  const suffix = String(index + 1).padStart(USERNAME_PAD, "0");

  return {
    username: `${USERNAME_PREFIX}${suffix}`,
    password: PASSWORD,
    nickname: `${NICKNAME_PREFIX}${suffix}`,
  };
}

export function setup() {
  const tokens = [];

  if (ACCOUNTS.length > 0 && ACCOUNTS.length < VUS) {
    throw new Error(`ACCOUNTS_FILE has ${ACCOUNTS.length} accounts, but VUS is ${VUS}.`);
  }

  for (let i = 1; i <= VUS; i += 1) {
    const account = accountAt(i - 1);

    // DB에 미리 넣은 500명 계정을 쓰는 경우 회원가입 요청 없이 로그인만 수행합니다.
    if (CREATE_USERS) {
      http.post(
        `${BASE_URL}/api/account`,
        JSON.stringify({
          username: account.username,
          password: account.password,
          nickname: account.nickname,
        }),
        jsonHeaders()
      );
    }

    // 각 VU가 서로 다른 계정으로 같은 좌석을 동시에 선점해야 실제 사용자 간 경쟁을 검증할 수 있습니다.
    const loginRes = http.post(`${BASE_URL}/api/token`, null, {
      headers: {
        Authorization: basicAuth(account.username, account.password),
      },
    });

    if (loginRes.status !== 200) {
      throw new Error(
        `login failed: username=${account.username}, status=${loginRes.status}, body=${loginRes.body}`
      );
    }

    tokens.push(loginRes.json("tokenValue"));
  }

  return { tokens };
}

export default function (data) {
  const token = data.tokens[__VU - 1];

  // 모든 VU가 같은 공연/회차/좌석으로 요청해야 Redis 선점 원자성이 지켜지는지 확인할 수 있습니다.
  const res = http.post(
    `${BASE_URL}/api/reservations/preempt-seats`,
    JSON.stringify({
      concertId: CONCERT_ID,
      scheduleId: SCHEDULE_ID,
      seatIds: [SEAT_ID],
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      tags: { name: "same-seat-preempt" },
    }
  );

  if (res.status === 200) {
    preemptSuccess.add(1);
    return;
  }

  if (res.status === 400 || res.status === 409 || res.status === 500) {
    preemptRejected.add(1);
    return;
  }

  preemptUnexpected.add(1);
}
