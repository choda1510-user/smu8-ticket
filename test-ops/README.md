# test-ops

부하 테스트와 테스트 데이터 등록을 한 곳에서 실행하기 위한 npm 작업 폴더입니다.

## 구성

- `k6/`: k6 부하 테스트 스크립트
- `scripts/`: 회원, 관리자 토큰, 공연장, 콘서트 등록 스크립트
- `testdata/`: 테스트 계정/공연장/콘서트 JSON 데이터
- `.env.local`: 로컬 서버용 실행 값
- `.env.remote`: 원격 서버용 실행 값

## 원격 환경 준비

처음 한 번만 예시 파일을 복사해서 원격 서버 주소를 넣습니다.

```bash
cp .env.remote.example .env.remote
```

`.env.remote`에서 아래 값을 원격 컴퓨터 주소로 바꿉니다.

```text
API_BASE_URL=http://REMOTE_BACKEND_HOST:8080
BASE_URL=http://REMOTE_BACKEND_HOST:8080
WAITING_API_BASE_URL=http://REMOTE_WAITING_HOST:8081
```

## 테스트 데이터 등록

로컬 서버에 등록:

```bash
npm run seed:local
```

원격 서버에 등록:

```bash
npm run seed:remote
```

개별 실행:

```bash
npm run accounts:remote
npm run admin-token:remote
npm run venues:remote
npm run concert:0001:remote
npm run concert:0002:remote
```

## k6 실행

서로 다른 좌석 선점:

```bash
npm run k6:different-seats:remote
```

대기열을 통과한 뒤 서로 다른 좌석 선점:

```bash
npm run k6:waiting-different-seats:remote
```

같은 좌석 동시 선점:

```bash
npm run k6:same-seat:remote
```

로컬 서버로 실행하려면 `:remote` 대신 `:local`을 사용합니다.

## 자주 바꾸는 값

`.env.local` 또는 `.env.remote`에서 아래 값을 바꿉니다.

```text
CONCERT_ID=1
SCHEDULE_ID=1
SEAT_ID=1
ACCOUNT_LIMIT=500
VUS=100
WAITING_TIMEOUT_SECONDS=120
WAITING_POLL_INTERVAL_SECONDS=2
```

## 주의

- 콘서트 등록은 공연장 id 매핑이 필요하므로 `venues`를 먼저 실행해야 합니다.
- `seed:*` 명령은 `accounts -> admin-token -> venues -> concerts` 순서로 실행합니다.
- `k6` 명령을 쓰려면 로컬에 k6가 설치되어 있어야 합니다.
