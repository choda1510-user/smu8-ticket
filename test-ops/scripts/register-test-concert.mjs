import fs from "node:fs";
import path from "node:path";

const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:8080";

function getAccessToken() {
  if (process.env.ADMIN_ACCESS_TOKEN) {
    return process.env.ADMIN_ACCESS_TOKEN;
  }
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

const rawArgs = process.argv.slice(2);
const options = { "concert-date": [] };
let dataFile = null;

for (const arg of rawArgs) {
  if (arg.startsWith("--")) {
    const [key, value] = arg.slice(2).split("=");
    if (key === "concert-date") {
      options["concert-date"].push(value);
    } else {
      options[key] = value;
    }
  } else {
    dataFile = arg;
  }
}

const reservationStart = options["reservation-start"];
const concertDates = options["concert-date"];

if (!dataFile || !reservationStart || concertDates.length === 0) {
  console.error(
    "사용법: node scripts/register-test-concert.mjs [파일경로] --reservation-start=2026-07-03T00:00:00 --concert-date=2026-07-16T19:00:00 [--concert-date=2026-07-20T19:00:00 ...]",
  );
  process.exit(1);
}

function toReservationEndAt(concertDate) {
  return `${concertDate.slice(0, 10)}T00:00:00`;
}

const DUMMY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const dummyPngBuffer = Buffer.from(DUMMY_PNG_BASE64, "base64");

const concert = JSON.parse(fs.readFileSync(path.resolve(dataFile), "utf8"));

const venueIdMap = JSON.parse(
  fs.readFileSync(path.resolve("testdata/output/venue-id-map.json"), "utf8"),
);
const venueId = venueIdMap[concert.venueName];

if (!venueId) {
  console.error(`공연장 id를 찾을 수 없음: ${concert.venueName}`);
  process.exit(1);
}

const schedules = concertDates.map((date) => ({
  date,
  reservationEndAt: toReservationEndAt(date),
}));

const request = {
  title: concert.title,
  description: concert.description,
  runningTime: concert.runningTime,
  reservationStartAt: reservationStart,
  venueId,
  notice: concert.notice,
  seatGrades: concert.seatGrades,
  schedules,
  seats: concert.seats,
  rowMax: concert.rowMax,
  colMax: concert.colMax,
};

const formData = new FormData();
formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
formData.append("cardPoster", new Blob([dummyPngBuffer], { type: "image/png" }), "card.png");
formData.append("bannerPoster", new Blob([dummyPngBuffer], { type: "image/png" }), "banner.png");
formData.append("descriptionPoster", new Blob([dummyPngBuffer], { type: "image/png" }), "description.png");

const response = await fetch(`${apiBaseUrl}/api/admin/concerts`, {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}` },
  body: formData,
});

if (!response.ok) {
  const message = await response.text();
  console.error(`❌ 실패: ${concert.title} (status=${response.status} ${message})`);
  process.exit(1);
}

const result = await response.json();
console.log(`✅ 생성: ${concert.title} (id=${result.id}, 회차 ${schedules.length}개)`);
