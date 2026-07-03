import fs from "node:fs";
import path from "node:path";

const dataFile = process.argv[2] ?? "testdata/smu8-ticket-venues-2.json";
const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";

function getAccessToken() {
  // 1순위: 환경변수로 직접 넘겨줬으면 그걸 씀
  if (process.env.ADMIN_ACCESS_TOKEN) {
    return process.env.ADMIN_ACCESS_TOKEN;
  }

  // 2순위: get-admin-token.mjs가 저장해둔 파일에서 자동으로 읽어옴
  const tokenFile = path.resolve("scripts/output/admin-token.txt");

  if (fs.existsSync(tokenFile)) {
    return fs.readFileSync(tokenFile, "utf8").trim();
  }

  return null;
}

const accessToken = getAccessToken();

if (!accessToken) {
  console.error("토큰이 없습니다. 먼저 node scripts/get-admin-token.mjs 를 실행하세요.");
  process.exit(1);
}

// 2) JSON 파일 읽어서 venues 배열 꺼내기
const resolvedPath = path.resolve(dataFile);
const data = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
const venues = data.venues;

console.log(`공연장 ${venues.length}개 등록 시작`);

// 3) 하나씩 순서대로 등록 (개수 적으니까 동시처리 필요 없음)
const idMap = {};

for (const venue of venues) {
  const response = await fetch(`${apiBaseUrl}/api/admin/venues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(venue),
  });

  if (!response.ok) {
    const message = await response.text();
    console.log(`❌ 실패: ${venue.name} (status=${response.status} ${message})`);
    continue;
  }

  const result = await response.json();
  console.log(`✅ 생성: ${venue.name} (id=${result.id})`);
  idMap[venue.name] = result.id;
}

// 4) 다음 단계(공연 등록)에서 쓸 수 있게 id 매핑 저장
fs.mkdirSync("testdata/output", { recursive: true });
fs.writeFileSync("testdata/output/venue-id-map.json", JSON.stringify(idMap, null, 2), "utf8");

console.log("");
console.log("공연장 id 매핑 저장 완료: testdata/output/venue-id-map.json");