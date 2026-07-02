# SMU 8기 티켓팅 웹사이트 프로젝트

- local: 데이터베이스등 모든 서버를 로컬에서 도커로 실행
- dev: 데이터베이스는 내부 서버를 공유하고 백엔드와 프론트엔드만 각자의 로컬에서 실행

- *-waiting: 대기열이 적용된 개발 환경

- test: 모든 서버를 내부 서버에서 실행

- load-test: 부하 테스트용 서버

## 개발 환경
ticket

- 개발환경(dev) bootRun
- 로컬개발환경(local-dev) bootRunLocal
- 대기열 적용 개발 환경(dev-waiting) bootRunWaiting
- 대기열 적용 로컬 개발 환경(local-dev-waiting) bootRunWaitingLocal

waiting

- 대기열 적용 개발환경(dev-waiting) bootRun
- 대기열 적용 로컬 개발 환경(local-dev-waiting) bootRunWaitingLocal

## 테스트 단계
도커 컴포즈 올리기
```bash
sudo docker compose -f docker-compose.test.yaml up -d --build
```
도커 컴포즈 내리기
```bash
sudo docker compose -f docker-compose.test.yaml down
```