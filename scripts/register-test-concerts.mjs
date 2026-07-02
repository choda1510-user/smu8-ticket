import fs from "node:fs";
import path from "node:path";

const dataFile = process.argv[2] ?? "testdata/smu8-ticket-venues-2.json";
const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";
const adminUsername = process.env.ADMIN_USERNAME ?? "loadtest_admin";

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

// 더미 이미지 준비 (1x1 투명 PNG, 3장 다 재사용)
const DUMMY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const dummyPngBuffer = Buffer.from(DUMMY_PNG_BASE64, "base64");

// 공연 데이터 읽기
const data = JSON.parse(fs.readFileSync(path.resolve(dataFile), "utf8"));
const concerts = data.concerts;

// 이전 단계에서 저장해둔 "공연장 이름 -> id" 매핑 읽기
const venueIdMap = JSON.parse(
  fs.readFileSync(path.resolve("testdata/output/venue-id-map.json"), "utf8"),
);

// 좌석 자동 생성 함수
function buildSeats(rowMax, colMax, seatGrades) {
  const seats = [];
  for (let row = 1; row <= rowMax; row += 1) {
    for (let col = 1; col <= colMax; col += 1) {
      const grade = seatGrades[(row + col) % seatGrades.length];
      seats.push({ seatGradeName: grade.gradeName, row, col });
    }
  }
  return seats;
}

console.log(`공연 ${concerts.length}개 등록 시작`);

for (const concert of concerts) {
  const venueId = venueIdMap[concert.venueName];

  if (!venueId) {
    console.log(`❌ 실패: ${concert.title} (공연장 id를 찾을 수 없음: ${concert.venueName})`);
    continue;
  }

  // 서버에 보낼 JSON 데이터 조립
  const request = {
    title: concert.title,
    description: concert.description,
    runningTime: concert.runningTime,
    reservationStartAt: concert.reservationStartAt,
    venueId,
    notice: concert.notice,
    seatGrades: concert.seatGrades,
    schedules: concert.schedules,
    seats: buildSeats(concert.rowMax, concert.colMax, concert.seatGrades),
    rowMax: concert.rowMax,
    colMax: concert.colMax,
  };

  // 택배 상자(FormData) 준비: JSON + 이미지 3장
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
  formData.append("cardPoster", new Blob([dummyPngBuffer], { type: "image/png" }), "card.png");
  formData.append("bannerPoster", new Blob([dummyPngBuffer], { type: "image/png" }), "banner.png");
  formData.append("descriptionPoster", new Blob([dummyPngBuffer], { type: "image/png" }), "description.png");

  const response = await fetch(`${apiBaseUrl}/api/admin/concerts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // 주의: Content-Type은 여기서 직접 안 씀! FormData가 알아서 붙여줌
    },
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    console.log(`❌ 실패: ${concert.title} (status=${response.status} ${message})`);
    continue;
  }

  const result = await response.json();
  console.log(`✅ 생성: ${concert.title} (id=${result.id})`);
}