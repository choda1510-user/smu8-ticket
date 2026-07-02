import fs from "node:fs";
import path from "node:path"

const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";
const adminUsername = process.env.ADMIN_USERNAME ?? "loadtest_admin";
const adminPassword = process.env.ADMIN_PASSWORD ?? "password1234";
const adminNickname = process.env.ADMIN_NICKNAME ?? "loadtest_admin_nick";

// 1. 회원가입 (이미 있는 계정이면 실패해도 무시하고 넘어감)
async function signUp() {
  const response = await fetch(`${apiBaseUrl}/api/account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: adminUsername,
      password: adminPassword,
      nickname: adminNickname,
    }),
  });

  if (response.ok) {
    console.log(`✅ 회원가입 완료: ${adminUsername}`);
    return;
  }

  console.log(`ℹ️ 회원가입 건너뜀 (이미 존재하거나 실패, status=${response.status}) - 계속 진행`);
}

// 2. 관리자로 승격
async function promoteToAdmin() {
  const response = await fetch(`${apiBaseUrl}/api/account/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: adminUsername }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`관리자 승격 실패: status=${response.status} ${message}`);
  }

  console.log(`✅ 관리자 승격 완료: ${adminUsername}`);
}

// 3. 로그인해서 토큰 받기 (Basic Auth)
function createBasicAuthHeader(username, password) {
  const encoded = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${encoded}`;
}

async function login() {
  const response = await fetch(`${apiBaseUrl}/api/token`, {
    method: "POST",
    headers: {
      Authorization: createBasicAuthHeader(adminUsername, adminPassword),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`로그인 실패: status=${response.status} ${message}`);
  }

  const token = await response.json();

  if (!token.tokenValue) {
    throw new Error("응답에 tokenValue가 없습니다.");
  }

  return token.tokenValue;
}

// 순서대로 실행
// 순서대로 실행
await signUp();
await promoteToAdmin();
const accessToken = await login();

// 토큰을 파일로 저장 (다른 스크립트가 자동으로 읽어갈 수 있게)
const tokenFile = path.resolve("scripts/output/admin-token.txt");
fs.mkdirSync(path.dirname(tokenFile), { recursive: true });
fs.writeFileSync(tokenFile, accessToken, "utf8");

console.log("");
console.log("✅ 관리자 토큰 발급 완료");
console.log(`저장 위치: ${tokenFile}`);

console.log("");
console.log("=== 관리자 액세스 토큰 ===");
console.log(accessToken);
console.log("==========================");
console.log("");
console.log("아래처럼 다른 스크립트에 넘겨서 쓰시면 됩니다:");
console.log(`ADMIN_ACCESS_TOKEN=${accessToken} node scripts/register-venues.mjs ...`);