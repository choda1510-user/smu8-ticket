회원 500명 넣는 명령:
node scripts/register-test-accounts.mjs


관리자 토큰 발급:
node scripts/get-admin-token.mjs


공연장 등록:
node scripts/register-test-venues.mjs


공연 등록:
node scripts/register-test-concerts.mjs testdata/smu8-ticket-concerts-2.json


전체 순서는 이게 제일 안전합니다.
node scripts/register-test-accounts.mjs
node scripts/get-admin-token.mjs
node scripts/register-test-venues.mjs
node scripts/register-test-concerts.mjs testdata/smu8-ticket-concerts-2.json
이유는 공연 등록이 공연장 id 매핑 파일을 필요로 해서, register-test-venues.mjs를 먼저 실행해야 합니다.