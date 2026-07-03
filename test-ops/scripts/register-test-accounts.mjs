import fs from "node:fs";
import path from "node:path";

const DEFAULT_DATA_FILE = "testdata/smu8-ticket-accounts-500.json";
const DEFAULT_API_BASE_URL = "http://localhost:8080";
const DEFAULT_CONCURRENCY = 10;

const dataFile = process.argv[2] ?? DEFAULT_DATA_FILE;
const apiBaseUrl = process.env.API_BASE_URL ?? DEFAULT_API_BASE_URL;
const concurrency = Number(process.env.CONCURRENCY ?? DEFAULT_CONCURRENCY);

function readAccounts(filePath) {
  const resolvedPath = path.resolve(filePath);
  const data = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));

  if (!Array.isArray(data.accounts)) {
    throw new Error("JSON 파일에 accounts 배열이 없습니다.");
  }

  return data.accounts;
}

async function isUsernameAvailable(username) {
  const url = new URL("/api/account/check-username", apiBaseUrl);
  url.searchParams.set("username", username);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`아이디 중복 확인 실패: ${username}, status=${response.status}`);
  }

  const result = await response.json();
  return Boolean(result.available);
}

async function registerAccount(account) {
  const available = await isUsernameAvailable(account.username);

  if (!available) {
    return { status: "skipped", username: account.username };
  }

  const response = await fetch(`${apiBaseUrl}/api/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: account.username,
      password: account.password,
      nickname: account.nickname,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return {
      status: "failed",
      username: account.username,
      reason: `status=${response.status} ${message}`,
    };
  }

  return { status: "created", username: account.username };
}

async function runWithConcurrency(items, worker, limit) {
  const results = [];
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      try {
        results[currentIndex] = await worker(items[currentIndex]);
      } catch (error) {
        results[currentIndex] = {
          status: "failed",
          username: items[currentIndex]?.username ?? `index-${currentIndex}`,
          reason: error instanceof Error ? error.message : String(error),
        };
      }
    }
  }

  const workerCount = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workerCount }, runWorker));
  return results;
}

const accounts = readAccounts(dataFile);

console.log(`회원가입 준비: ${accounts.length}명`);
console.log(`API 주소: ${apiBaseUrl}`);
console.log(`데이터 파일: ${path.resolve(dataFile)}`);
console.log(`동시 처리 수: ${concurrency}`);

const results = await runWithConcurrency(accounts, registerAccount, concurrency);

const created = results.filter((result) => result.status === "created");
const skipped = results.filter((result) => result.status === "skipped");
const failed = results.filter((result) => result.status === "failed");

console.log("");
console.log("회원가입 결과");
console.log(`- 생성: ${created.length}명`);
console.log(`- 이미 존재해서 건너뜀: ${skipped.length}명`);
console.log(`- 실패: ${failed.length}명`);

if (failed.length > 0) {
  console.log("");
  console.log("실패 목록");
  failed.slice(0, 20).forEach((result) => {
    console.log(`- ${result.username}: ${result.reason}`);
  });

  if (failed.length > 20) {
    console.log(`...외 ${failed.length - 20}건`);
  }

  process.exitCode = 1;
}
