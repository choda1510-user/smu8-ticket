# SMU 8기 티켓팅 웹사이트 프로젝트

- local

데이터베이스등 모든 서버를 로컬에서 도커로 실행
- dev

데이터베이스는 내부 서버를 공유하고 백엔드와 프론트엔드만 각자의 로컬에서 실행
- test

모든 서버를 내부 서버에서 실행

## 테스트 단계
도커 컴포즈 올리기
```bash
sudo docker compose -f docker-compose.test.yaml up -d --build
```
도커 컴포즈 내리기
```bash
sudo docker compose -f docker-compose.test.yaml down
```