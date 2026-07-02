# 같은 좌석 동시 선점 k6 테스트 케이스

## 1. 테스트 목적

같은 공연, 같은 회차, 같은 좌석에 여러 사용자가 동시에 선점 요청을 보냈을 때 좌석 선점이 정확히 1건만 성공하는지 검증합니다.

이 테스트는 Redis 기반 좌석 선점 로직의 동시성 정합성을 확인하기 위한 테스트입니다.

## 2. 테스트 대상

| 항목 | 값 |
| --- | --- |
| 대상 API | `POST /api/reservations/preempt-seats` |
| k6 스크립트 | `k6/preempt-same-seat.js` |
| 테스트 유형 | 같은 좌석 동시 선점 경쟁 |
| 실행 계정 | `smu8_user_0001` ~ `smu8_user_0500` |
| 기본 비밀번호 | `password1234` |
| 테스트 일자 | `2026-07-01` |

## 3. 테스트 데이터

| 항목 | 값 |
| --- | --- |
| `BASE_URL` | `http://127.0.0.1:8080` |
| `CONCERT_ID` | `1` |
| `SCHEDULE_ID` | `1` |
| `SEAT_ID` | `1` |
| Redis 선점 key | `reservation:preempt:seat:1` |

## 4. 사전 조건

- 백엔드 서버가 `http://127.0.0.1:8080`에서 실행 중이어야 합니다.
- MySQL과 Redis가 실행 중이어야 합니다.
- DB에 `smu8_user_0001`부터 `smu8_user_0500`까지 테스트 계정이 존재해야 합니다.
- 각 테스트 실행 전에 Redis 선점 key를 삭제해야 합니다.

Redis key 초기화:

```bash
sudo docker exec redis-ticket redis-cli DEL reservation:preempt:seat:1
```

## 5. 실행 방법

단일 실행 예시:

```powershell
& 'C:\Program Files\k6\k6.exe' run `
  -e BASE_URL=http://127.0.0.1:8080 `
  -e VUS=100 `
  -e CONCERT_ID=1 `
  -e SCHEDULE_ID=1 `
  -e SEAT_ID=1 `
  --summary-export .\k6\result-vus-100.json `
  .\k6\preempt-same-seat.js
```

100, 200, 300, 400, 500명 반복 실행 예시:

```powershell
foreach ($vus in 100,200,300,400,500) {
  & 'C:\Program Files\k6\k6.exe' run `
    -e BASE_URL=http://127.0.0.1:8080 `
    -e VUS=$vus `
    -e CONCERT_ID=1 `
    -e SCHEDULE_ID=1 `
    -e SEAT_ID=1 `
    --summary-export ".\k6\result-vus-$vus.json" `
    .\k6\preempt-same-seat.js
}
```

반복 실행 시에도 각 실행 전에 Redis 선점 key를 삭제해야 합니다.

## 6. 판정 기준

| 항목 | 정상 기준 |
| --- | --- |
| `preempt_success` | `1` |
| `preempt_rejected` | `VUS - 1` |
| `preempt_unexpected` | `0` |

`http_req_failed` 값은 높게 나올 수 있습니다. 같은 좌석을 이미 다른 사용자가 선점한 뒤 나머지 요청이 실패 응답을 받는 것은 이 테스트에서 기대하는 동작입니다.

따라서 이 테스트의 핵심 판정 기준은 `http_req_failed`가 아니라 k6 custom counter인 `preempt_success`, `preempt_rejected`, `preempt_unexpected`입니다.

## 7. 실제 실행 결과

| VUS | 결과 파일 | 성공 | 거절 | 예상외 | HTTP 요청 수 | HTTP 실패율 | 평균 응답 시간(ms) | p95(ms) | 최대(ms) | 판정 |
| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 100 | `result-vus-100.json` | 1 | 99 | 0 | 200 | 49.50% | 138.21 | 333.76 | 389.02 | PASS |
| 200 | `result-vus-200.json` | 1 | 199 | 0 | 400 | 49.75% | 301.27 | 995.78 | 1144.35 | PASS |
| 300 | `result-vus-300.json` | 1 | 299 | 0 | 600 | 49.83% | 376.14 | 1189.05 | 1417.74 | PASS |
| 400 | `result-vus-400.json` | 1 | 399 | 0 | 800 | 49.88% | 474.55 | 1450.70 | 1681.82 | PASS |
| 500 | `result-vus-500.json` | 1 | 499 | 0 | 1000 | 49.90% | 556.67 | 1856.64 | 2058.24 | PASS |

## 8. 결론

100명부터 500명까지 같은 좌석을 동시에 선점하도록 요청했을 때 모든 테스트에서 선점 성공은 1건만 발생했습니다.

따라서 현재 Redis 좌석 선점 로직은 같은 좌석 동시 선점 상황에서 중복 선점을 허용하지 않는 것으로 확인했습니다.

## 9. 공유 시 주의사항

`--summary-export`로 생성된 원본 JSON에는 `setup_data.tokens`에 로그인 토큰이 포함됩니다.

팀원에게 결과를 공유할 때는 원본 JSON을 그대로 외부에 공유하기보다 이 문서의 요약 결과를 공유하는 것을 권장합니다.
