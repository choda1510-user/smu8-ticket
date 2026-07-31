# SMU 8기 티켓팅 웹사이트 프로젝트

## 스프링부트 프로파일 접두사 의미

### local
데이터베이스등 모든 서버를 로컬에서 도커로 실행

backend-ticket gradle tasks

- bootRunLocal
- bootRunLocalWaiting

backend-waiting gradle tasks

- bootRunLocalWaiting

---

### dev
데이터베이스는 원격 서버를 공유하고 백엔드와 프론트엔드만 각자의 로컬에서 실행

backend-ticket gradle tasks

- bootRun
- bootRunWaiting

backend-waiting gradle tasks

- bootRun

---

### test
테스트 원격 서버를 기준으로 하는 환경설정

---

### prod
배포 환경을 기준으로 하는 환경설정

## 스프링부트 프로파일 접미사 의미

### waiting
대기열 로직을 활성화하는 환경설정

## 테스트 단계
도커 컴포즈 올리기
```bash
sudo docker compose -f docker-compose.test.yaml up -d --build
```
도커 컴포즈 내리기
```bash
sudo docker compose -f docker-compose.test.yaml down
```

## 부하 테스트와 테스트 데이터 등록

부하 테스트 스크립트, 테스트 데이터, 데이터 등록 명령은 `test-ops` 폴더에서 관리합니다.

```bash
cd test-ops
```

로컬 서버에 테스트 데이터를 등록하려면 다음 명령을 실행합니다.

```bash
npm run seed:local
```

원격 서버에 테스트 데이터를 등록하려면 `.env.remote.example`을 `.env.remote`로 복사한 뒤 서버 주소를 수정하고 실행합니다.

```bash
cp .env.remote.example .env.remote
npm run seed:remote
```

k6 부하 테스트도 같은 폴더에서 실행합니다.

```bash
npm run k6:different-seats:remote
npm run k6:same-seat:remote
```
