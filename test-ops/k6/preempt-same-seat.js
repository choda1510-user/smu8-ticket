import http from "k6/http";
import encoding from "k6/encoding";
import { Counter } from "k6/metrics";
import { SharedArray } from "k6/data";

const BASE_URL = __ENV.BASE_URL || "http://127.0.0.1:8080";
const VUS = Number(__ENV.VUS || 500);
const CONCERT_ID = Number(__ENV.CONCERT_ID || 1);
const SCHEDULE_ID = Number(__ENV.SCHEDULE_ID || 1);
const SEAT_ID = Number(__ENV.SEAT_ID || 1);
const PASSWORD = __ENV.PASSWORD || "password1234";
const CREATE_USERS = (__ENV.CREATE_USERS || "false").toLowerCase() === "true";

const accounts = new SharedArray("accounts", () => {
  const data = JSON.parse(open("../testdata/smu8-ticket-accounts-500.json"));
  return data.accounts.slice(0, VUS);
});

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

export function setup() {
  const tokens = [];

  if (accounts.length < VUS) {
    throw new Error(`계정이 부족합니다. accounts=${accounts.length}, VUS=${VUS}`);
  }

  for (let i = 0; i < VUS; i++) {
    const account = accounts[i];

    if (CREATE_USERS) {
      http.post(
          `${BASE_URL}/api/account`,
          JSON.stringify({
            username: account.username,
            password: account.password || PASSWORD,
            nickname: account.nickname,
          }),
          jsonHeaders()
      );
    }

    const loginRes = http.post(`${BASE_URL}/api/token`, null, {
      headers: {
        Authorization: basicAuth(
            account.username,
            account.password || PASSWORD
        ),
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
        tags: {
          name: "POST /api/reservations/preempt-seats same seat",
        },
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