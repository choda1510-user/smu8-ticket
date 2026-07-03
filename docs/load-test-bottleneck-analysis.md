# 부하 테스트 병목 분석 도구 및 Redis 테스트 환경 개선 방안

## 1. 배경

현재 부하 테스트는 K6를 사용해 사용자의 요청 흐름을 재현하고 있다. K6는 "사용자 입장에서 요청이 몇 초 걸렸는지", "몇 건이 실패했는지", "동시 요청 시 성공률이 얼마나 떨어졌는지"를 확인하기에 적합하다.

그러나 K6 결과만으로는 다음 질문에 답하기 어렵다.

- 사용자가 입장하는 데 10초가 걸린 이유가 백엔드 CPU 때문인지, Redis 때문인지, DB 때문인지 알 수 없다.
- 선점 요청 N명이 실패했을 때 애플리케이션 로직 문제인지, Redis 지연인지, Docker 테스트 환경 문제인지 구분하기 어렵다.
- 컨테이너별 CPU, 메모리, 네트워크, 디스크 I/O 상태를 K6만으로는 직접 확인할 수 없다.

따라서 K6는 계속 사용하되, K6 결과와 서버 내부 지표를 함께 수집하는 방식으로 테스트 환경을 확장해야 한다.

## 2. K6로 알 수 있는 것과 알기 어려운 것

K6로 알 수 있는 것:

- API별 응답 시간
- 요청 성공률과 실패율
- 동시 사용자 증가에 따른 처리량 변화
- 특정 시점에 timeout 또는 4xx/5xx가 증가했는지 여부
- 사용자 시나리오 기준으로 "체감 성능"이 나빠지는 구간

K6만으로 알기 어려운 것:

- 백엔드 컨테이너 CPU가 포화됐는지
- Redis 컨테이너가 CPU, 메모리, swap 문제를 겪었는지
- MySQL 커넥션 또는 쿼리 지연이 병목인지
- JVM GC, 스레드, 커넥션 풀 문제가 있었는지
- Docker 컨테이너의 메모리 제한 또는 swap 설정 때문에 지연이 발생했는지
- 네트워크 I/O 또는 디스크 I/O가 튀었는지

즉, K6는 "문제가 발생했다"는 사실을 알려주지만, "왜 발생했는지"는 별도의 관측 도구가 필요하다.

## 3. 병목 분석을 위해 수집해야 할 지표

부하 테스트 중에는 최소한 다음 지표를 함께 수집한다.

| 영역 | 확인할 지표 | 병목 의심 신호 |
| --- | --- | --- |
| K6 | 응답 시간, 실패율, 요청 처리량 | p95/p99 증가, timeout 증가, 실패율 증가 |
| Docker 컨테이너 | CPU %, 메모리 사용량, 네트워크 I/O, 블록 I/O | 특정 컨테이너 CPU 100% 근접, 메모리 한계 근접 |
| Redis | used_memory, connected_clients, ops/sec, rejected_connections, latency | 메모리 급증, 연결 거부, latency spike |
| Spring Boot | HTTP 요청 시간, JVM heap, GC, thread, datasource | GC 증가, 스레드 고갈, DB 커넥션 부족 |
| MySQL | CPU, connection, slow query, lock | 커넥션 포화, slow query 증가, lock wait |

## 4. 도구 후보와 사용 방식

### 4.1 docker stats

`docker stats`는 가장 먼저 사용할 수 있는 도구이다. 별도 설치가 거의 필요 없고, 컨테이너별 CPU/메모리/네트워크/디스크 I/O를 즉시 확인할 수 있다.

사용 예시:

```bash
docker stats
```

특정 컨테이너만 확인:

```bash
docker stats backend database redis-ticket
```

결과 형태 예시:

```text
CONTAINER ID   NAME           CPU %     MEM USAGE / LIMIT     NET I/O       BLOCK I/O
abc123         backend        85.42%    620MiB / 1GiB         120MB / 95MB  12MB / 4MB
def456         redis-ticket   12.10%    180MiB / 512MiB       80MB / 70MB   2MB / 1MB
ghi789         database       35.20%    700MiB / 1GiB         60MB / 50MB   40MB / 20MB
```

해석 방법:

- K6 응답 시간이 증가한 시점에 `backend` CPU가 높으면 애플리케이션 병목 가능성이 크다.
- `redis-ticket` 메모리가 제한에 가까우면 Redis 메모리 설정 또는 swap 문제를 의심한다.
- `database` CPU나 block I/O가 높으면 DB 쿼리 또는 디스크 병목을 의심한다.

공식 문서: [Docker container stats](https://docs.docker.com/reference/cli/docker/container/stats/)

### 4.2 cAdvisor

cAdvisor는 컨테이너별 CPU, 메모리, 네트워크, 파일 시스템 지표를 더 자세히 수집하는 도구이다. 단독으로도 볼 수 있고 Prometheus와 연결해 장기 그래프로 저장할 수 있다.

적용 방식:

1. Docker Compose에 cAdvisor 컨테이너를 추가한다.
2. cAdvisor가 Docker 컨테이너 지표를 수집한다.
3. Prometheus가 cAdvisor의 `/metrics`를 scrape한다.
4. Grafana에서 컨테이너별 지표를 대시보드로 확인한다.

확인 가능한 결과:

- 컨테이너별 CPU 사용률 추이
- 컨테이너별 메모리 사용량 추이
- 네트워크 송수신량
- 파일 시스템 I/O
- 테스트 시작 전/중/후 지표 비교

공식 문서: [cAdvisor Prometheus storage](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md)

### 4.3 Prometheus + Grafana

Prometheus는 시간에 따른 지표를 저장하고 질의하는 도구이고, Grafana는 그 지표를 그래프로 시각화하는 도구이다. 부하 테스트에서는 "K6 응답 시간이 튄 시점"과 "서버 자원 사용량이 튄 시점"을 같은 시간축에서 비교하는 데 유용하다.

적용 방식:

1. Prometheus 컨테이너를 실행한다.
2. cAdvisor, Spring Boot Actuator, Redis exporter 등의 `/metrics`를 Prometheus가 수집하게 한다.
3. Grafana에서 Prometheus를 datasource로 연결한다.
4. K6 테스트 시간대의 그래프를 확인한다.

확인 가능한 결과:

- p95 응답 시간이 증가한 시점의 backend CPU
- Redis memory/ops/sec 변화
- JVM heap/GC 변화
- DB 커넥션 풀 사용량 변화

공식 문서: [Prometheus overview](https://prometheus.io/docs/introduction/overview/)

### 4.4 K6 + Prometheus remote write

K6 결과도 Prometheus로 보낼 수 있다. 이렇게 하면 K6의 응답 시간/실패율과 컨테이너 지표를 Grafana에서 같은 화면에 놓고 비교할 수 있다.

사용 예시:

```bash
K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write \
K6_PROMETHEUS_RW_TREND_STATS=p(95),p(99),min,max \
k6 run -o experimental-prometheus-rw test-ops/k6/preempt-different-seats.js
```

확인 가능한 결과:

- `k6_http_req_duration_p95`
- `k6_http_req_duration_p99`
- `k6_http_reqs_total`
- `k6_checks_rate`
- `k6_http_req_failed_rate`

이 지표를 backend/redis/database 컨테이너 지표와 함께 보면 병목 후보를 좁힐 수 있다.

공식 문서: [k6 Prometheus remote write](https://grafana.com/docs/k6/latest/results-output/real-time/prometheus-remote-write/)

### 4.5 Redis INFO / redis-cli

Redis 자체 상태는 `redis-cli INFO`로 확인할 수 있다. Redis가 병목인지 의심될 때는 컨테이너 자원 사용량뿐 아니라 Redis 내부 지표도 같이 확인해야 한다.

사용 예시:

```bash
docker exec -it redis-ticket redis-cli INFO
```

중점 확인 항목:

```text
used_memory
used_memory_human
connected_clients
blocked_clients
instantaneous_ops_per_sec
rejected_connections
expired_keys
evicted_keys
mem_fragmentation_ratio
```

해석 방법:

- `used_memory`가 계속 증가하면 Redis 메모리 설정을 확인한다.
- `rejected_connections`가 증가하면 연결 수 제한 또는 Redis 포화 가능성을 본다.
- `evicted_keys`가 증가하면 `maxmemory`와 eviction policy 설정을 확인한다.
- Redis latency가 튀면 swap, THP, CPU, 네트워크 문제를 함께 확인한다.

관련 문서: [Redis latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

### 4.6 Spring Boot Actuator + Micrometer

백엔드 애플리케이션 내부 병목은 Spring Boot Actuator와 Micrometer로 확인할 수 있다.

확인 가능한 지표:

- HTTP 요청 처리 시간
- JVM heap/non-heap 메모리
- GC 횟수와 시간
- live thread 수
- datasource 커넥션 풀 사용량
- Tomcat request/thread 상태

적용 방식:

1. Spring Boot Actuator 의존성을 추가한다.
2. Prometheus registry 의존성을 추가한다.
3. `/actuator/prometheus` endpoint를 노출한다.
4. Prometheus가 해당 endpoint를 scrape한다.

공식 문서: [Spring Boot metrics](https://docs.spring.io/spring-boot/reference/actuator/metrics.html)

## 5. 권장 관측 구성

1차 구성은 가볍게 시작한다.

```text
K6
+ docker stats
+ redis-cli INFO
```

이 구성으로 먼저 "어느 컨테이너가 튀는지"를 확인한다.

2차 구성은 그래프 기반으로 확장한다.

```text
K6
+ Prometheus
+ Grafana
+ cAdvisor
+ Redis exporter
+ Spring Boot Actuator
```

이 구성은 테스트 결과를 시간축으로 남길 수 있으므로, 보고서와 회고에 적합하다.

## 6. Redis Docker 테스트 환경 문제 가능성

현재 문제는 테스트 데이터나 서버 구현 문제가 아니라, Docker로 올린 Redis 테스트 환경 문제일 가능성도 있다.

Redis는 메모리 기반 저장소이므로 메모리 접근이 느려지면 응답 시간이 크게 증가할 수 있다. 특히 Redis 프로세스가 swap 영역을 사용하게 되면 디스크 접근이 섞이면서 latency가 급격히 증가할 수 있다.

따라서 부하 테스트 환경에서는 Redis 컨테이너가 다음 조건을 만족하도록 구성해야 한다.

- Redis 컨테이너의 메모리 한계를 명확히 설정한다.
- Redis 컨테이너가 swap을 사용하지 않도록 제한한다.
- Redis 내부 `maxmemory`를 컨테이너 메모리 제한보다 낮게 설정한다.
- 테스트 중 Redis 메모리 사용량과 latency를 관측한다.

## 7. Redis가 swap을 사용하지 않도록 하는 방법

### 7.1 우선 적용안: Docker memory/swap 제한

Docker Compose에서 Redis 컨테이너에 메모리 제한을 둔다. 핵심은 `mem_limit`과 `memswap_limit`을 같은 값으로 두는 것이다. Docker 문서에 따르면 `memswap_limit`이 `memory`와 같은 값이면 컨테이너가 swap에 접근하지 못한다.

예시:

```yaml
services:
  redis-ticket:
    build:
      context: ./redis-ticket
      dockerfile: Dockerfile.dev
    container_name: redis-ticket
    ports:
      - "6379:6379"
    mem_limit: 512m
    memswap_limit: 512m
    networks:
      - smu8-ticket-network
```

의도:

- Redis 컨테이너가 사용할 수 있는 메모리를 512MB로 제한한다.
- memory + swap 총량도 512MB로 제한해 swap 사용을 막는다.
- 테스트 중 Redis가 메모리 한계에 가까워지는지 관측한다.

공식 문서: [Docker Compose memswap_limit](https://docs.docker.com/reference/compose-file/services/#memswap_limit)

### 7.2 함께 적용 권장: Redis maxmemory

Docker 컨테이너 제한만 두면 Redis가 컨테이너 메모리 한계까지 사용하다가 OOM으로 종료될 수 있다. Redis 내부에도 `maxmemory`를 설정해 컨테이너 한계보다 낮은 지점에서 Redis가 자체 정책으로 메모리를 관리하도록 한다.

예시:

```text
maxmemory 400mb
maxmemory-policy allkeys-lru
```

의도:

- 컨테이너 한계가 512MB라면 Redis는 그보다 낮은 400MB 선에서 메모리를 관리한다.
- 테스트 데이터가 예상보다 커져도 Redis가 갑자기 OOM으로 죽는 상황을 줄인다.
- eviction 발생 여부는 `INFO`의 `evicted_keys`로 확인한다.

공식 문서: [Redis memory optimization](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/)

### 7.3 서버 환경까지 관리할 수 있을 때: swappiness, THP, overcommit

Linux 서버를 직접 관리할 수 있다면 다음 항목도 확인한다.

- `vm.swappiness`를 낮춰 swap 사용 가능성을 줄인다.
- Transparent Huge Pages(THP)를 비활성화한다.
- Redis 권장값에 맞게 `vm.overcommit_memory`를 설정한다.

이 설정은 Docker Compose 파일만으로 끝나는 문제가 아니라 호스트 OS 설정에 가깝다. 따라서 팀 테스트 서버에서 적용 가능 여부를 별도로 확인해야 한다.

주의:

- macOS Docker Desktop에서는 실제 Linux VM 안에서 Docker가 동작하므로, 호스트 Linux와 설정 방식이 다를 수 있다.
- 운영 서버와 로컬 Docker Desktop의 메모리/swap 동작은 다를 수 있다.
- 문서에는 적용 방법뿐 아니라 실제 적용 여부와 확인 결과를 함께 기록해야 한다.

관련 문서: [Redis latency diagnosis](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/)

## 8. 테스트 진행 절차

권장 절차:

1. 기존 K6 테스트를 그대로 실행한다.
2. 같은 시간에 `docker stats`를 실행해 컨테이너별 자원 사용량을 기록한다.
3. Redis에 대해 `redis-cli INFO`를 테스트 전/중/후로 저장한다.
4. 응답 시간이 증가한 시점의 backend, redis-ticket, database 지표를 비교한다.
5. Redis 메모리/swap 제한을 적용한 Compose 설정으로 다시 테스트한다.
6. 적용 전/후 결과를 표로 비교한다.

결과 기록 표:

| 테스트 조건 | K6 p95 | K6 p99 | 실패율 | backend CPU | redis 메모리 | redis ops/sec | database CPU | 관찰 결과 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 기존 환경 |  |  |  |  |  |  |  |  |
| Redis memory/swap 제한 적용 |  |  |  |  |  |  |  |  |
| Redis maxmemory 적용 |  |  |  |  |  |  |  |  |
| Prometheus/Grafana 관측 환경 |  |  |  |  |  |  |  |  |

## 9. 결론

K6는 사용자 관점의 성능 저하를 확인하는 데 필요하지만, 병목 원인을 직접 알려주지는 않는다. 따라서 부하 테스트의 다음 단계는 K6를 대체하는 것이 아니라 K6에 컨테이너/Redis/JVM/DB 지표를 결합하는 것이다.

가장 먼저 적용할 것은 다음 두 가지이다.

1. K6 테스트 중 `docker stats`와 `redis-cli INFO`를 함께 기록한다.
2. Redis 컨테이너에 `mem_limit`과 `memswap_limit`을 설정하고, Redis 내부에는 `maxmemory`를 설정한다.

이후 Prometheus + Grafana + cAdvisor + Spring Boot Actuator 구성으로 확장하면, "사용자 입장에서 느린 현상"과 "서버 내부 병목"을 같은 시간축에서 분석할 수 있다.
