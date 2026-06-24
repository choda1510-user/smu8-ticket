# AGENTS.md

## 적용 범위

이 문서는 `backend-ticket` 프로젝트에 적용됩니다.

프론트엔드 파일은 사용자가 명시적으로 요청한 경우에만 수정합니다.

하위 디렉터리에 `RULE.md`가 있는 경우 해당 규칙을 우선 적용합니다. 규칙이 충돌한다면 더 구체적인 하위 규칙을 우선합니다.

## 프로젝트 의도

이 백엔드는 Spring Boot 기반 티켓 예매 서비스입니다.

코드는 도메인별 패키지를 기준으로 구성하고, 각 책임은 계층별로 분리합니다.

현재는 `account` 패키지를 기준 구조로 삼습니다. 이후 `concert`, `booking`, `payment`, `venue`, `reservation` 같은 도메인을 구현할 때도 같은 방향을 따릅니다.

기본 계층은 다음과 같습니다.

- 프레젠테이션 계층: `controller`, `http/request`, `http/response`
- 비즈니스 계층: `service`, `dto/query`, `dto/command`, `dto/result`
- 퍼시스턴스 계층: `entity`, `repository`
- 인프라 계층: `config`, `authentication`, `filter`, `provider`, `utils`

## 권장 도메인 구조

새로운 도메인 패키지는 보통 아래 구조를 따릅니다.

```text
domain
├── controller
├── http
│   ├── request
│   └── response
├── dto
│   ├── query
│   ├── command
│   └── result
├── service
├── entity
└── repository
```

다만 모든 폴더를 기계적으로 먼저 만들 필요는 없습니다. 실제 책임이 생겼을 때 필요한 폴더를 추가합니다.

## 프레젠테이션 계층 규칙

컨트롤러는 HTTP 경계만 담당합니다.

컨트롤러에서 해도 되는 일은 다음과 같습니다.

- HTTP 요청 받기
- request DTO 검증하기
- request DTO를 command 또는 query DTO로 변환하기
- service 호출하기
- service result DTO를 response DTO로 변환하기
- 적절한 HTTP 상태 코드 반환하기

컨트롤러에서 하면 안 되는 일은 다음과 같습니다.

- repository 직접 호출
- JPA entity 직접 반환
- 비즈니스 규칙 작성
- DB 접근 로직 작성
- 인증, 인가, 비밀번호, 결제, 예매, 좌석 상태 판단 같은 핵심 로직 작성

HTTP 요청 DTO는 `http/request`에 둡니다.

HTTP 응답 DTO는 `http/response`에 둡니다.

조회 요청은 가능하면 path variable, query parameter 같은 HTTP 프로토콜 정보를 사용합니다.

생성, 수정, 삭제 요청은 `http/request`의 request DTO를 사용합니다.

## DTO 규칙

컨트롤러와 서비스 사이에서 사용하는 DTO는 `dto` 패키지에 둡니다.

하위 패키지는 다음 기준을 따릅니다.

- `dto/query`: 컨트롤러에서 서비스로 전달하는 조회 요청
- `dto/command`: 컨트롤러에서 서비스로 전달하는 생성, 수정, 삭제 요청
- `dto/result`: 서비스에서 컨트롤러로 반환하는 결과

기본 데이터 흐름은 아래와 같습니다.

```text
Request -> Command 또는 Query -> Service -> Result -> Response
```

예시:

```text
CreateAccountRequest
-> CreateAccountCommand
-> AccountService
-> AccountDetailResult
-> AccountDetailResponse
```

entity를 API 응답으로 직접 노출하지 않습니다.

service가 HTTP request DTO 또는 response DTO에 직접 의존하지 않도록 합니다.

## 서비스 계층 규칙

service는 비즈니스 로직을 담당합니다.

service에서 해도 되는 일은 다음과 같습니다.

- 도메인 규칙 처리
- entity 생성 또는 변경
- repository 호출
- 트랜잭션 처리
- entity를 result DTO로 변환
- 여러 도메인을 거치는 use case 조율

service에서 하면 안 되는 일은 다음과 같습니다.

- HTTP response DTO 반환
- controller 클래스 의존
- 일반 도메인 서비스에서 servlet request 또는 response 직접 의존
- 관련 없는 책임을 하나의 구현체에 과도하게 섞기

도메인이 커질 가능성이 있다면 서비스 인터페이스와 구현체를 분리합니다.

```text
AccountService
AccountServiceImpl
```

서비스 구현체에는 `@Service`를 사용합니다.

상태를 변경하는 비즈니스 메서드에는 `@Transactional` 사용을 고려합니다.

순수 조회 메서드는 필요하면 read-only transaction을 사용합니다.

## 퍼시스턴스 계층 규칙

JPA entity는 `entity`에 둡니다.

Spring Data repository는 `repository`에 둡니다.

repository는 controller가 아니라 service에서 호출합니다.

repository에는 비즈니스 로직을 넣지 않습니다.

entity는 controller에서 직접 반환하지 않습니다.

repository 메서드는 의미가 드러나는 이름을 사용합니다.



## Entity 규칙

entity는 DB에 저장되는 도메인 상태를 표현합니다.

상태 변경은 의도를 드러내는 방식으로 작성합니다. 도메인 규칙이 중요한 경우 모든 필드에 public setter를 열어두는 방식은 피합니다.

의미 있는 상태 변경은 메서드 이름으로 표현합니다.




필요한 경우 `createdAt`, `updatedAt` 같은 감사 필드를 일관되게 사용합니다.

## 인증과 보안 규칙

인증, JWT, refresh token, security filter, provider 코드는 인프라 성격의 패키지에 둡니다.

현재 인프라 성격의 패키지는 다음과 같습니다.

- `authentication`
- `auth/filter`
- `auth/provider`
- `config`
- `utils`

토큰 생성, 쿠키 처리, `SecurityFilterChain` 설정을 일반 도메인 컨트롤러나 서비스에 섞지 않습니다.

인증 전용 서비스는 security 개념에 의존할 수 있습니다. 하지만 일반 도메인 서비스는 가능하면 Spring Security 클래스에 직접 의존하지 않도록 합니다.

## 예외 처리 규칙

의미 없는 `orElseThrow()` 대신 도메인 의미가 드러나는 예외나 에러 코드를 사용합니다.



공통 API 에러 응답은 `http/response/ErrorResponse`, `ErrorCode` 구조를 따릅니다.

새 도메인을 추가할 때는 자주 발생하는 에러를 초기에 정리합니다.

- 존재하지 않는 리소스
- 중복 리소스
- 잘못된 상태
- 권한 없는 작업
- 만료된 예매
- 결제 실패

## 검증 규칙

외부 입력값은 request 경계에서 검증합니다.

request DTO에는 필요에 따라 Bean Validation을 사용합니다.



현재 도메인 상태를 확인해야 하는 검증은 service 계층에서 처리합니다.

## 민감 정보 규칙

민감 정보는 response DTO에 노출하지 않습니다.

민감 정보 예시는 다음과 같습니다.

- 비밀번호
- 비밀번호 해시
- refresh token
- access token 내부 정보
- security credential
- 내부 인증 상세 정보

내부 처리를 위해 service result에 민감 정보가 포함되어 있다면 response 변환 과정에서 반드시 제거합니다.

가능하면 result DTO에도 민감 정보를 포함하지 않는 방향을 우선합니다.

## 예매 도메인 예상 규칙

예매 관련 코드는 예매 흐름과 상태 전이를 명확하게 표현해야 합니다.

예상되는 예매 상태는 다음과 같습니다.

- 대기
- 좌석 선택
- 가격 선택
- 결제 대기
- 결제 완료
- 예매 완료
- 예매 취소
- 예매 만료

좌석 상태는 특히 신중하게 다룹니다.

예상되는 좌석 상태는 다음과 같습니다.

- 선택 가능
- 선택 중
- 예약됨
- 판매 완료
- 비활성

좌석 상태 전이는 service 계층이 소유합니다. controller에서 좌석 선택 가능 여부나 예약 가능 여부를 직접 판단하지 않습니다.

결제와 예매 완료는 단순 응답 메시지가 아니라 상태 전이로 모델링합니다.

## 공연 도메인 예상 규칙

공연 관련 도메인은 아래 개념을 분리해서 생각합니다.

- 공연 정보
- 공연 일정
- 공연장 정보
- 좌석 배치
- 티켓 가격
- 예매 가능 상태

모든 공연 관련 데이터를 하나의 거대한 entity에 넣지 않습니다. 책임이 분리되는 개념은 별도 entity나 값 객체로 나누는 방향을 우선 검토합니다.

목록과 검색 API를 구현할 때는 query DTO로 아래 조건을 표현할 수 있게 합니다.

- 검색어
- 페이지 번호
- 페이지 크기
- 정렬
- 상태
- 카테고리
- 날짜 범위

## API 응답 규칙

response DTO는 프론트엔드에서 안정적으로 사용하기 쉬운 형태여야 합니다.

필드명은 명확하게 작성하고, DB 구현 세부사항이 API 응답에 드러나지 않도록 합니다.

페이지네이션 응답에는 프론트엔드 구현에 필요한 정보를 포함합니다.

- 현재 페이지
- 페이지 크기
- 전체 데이터 개수
- 전체 페이지 수
- 다음 페이지 존재 여부
- 이전 페이지 존재 여부

비슷한 목록 API들은 응답 구조를 일관되게 유지합니다.

## 이름 규칙

이름은 use case가 드러나도록 작성합니다.

좋은 예시:

- `CreateAccountCommand`
- `AccountDetailResult`
- `ConcertSearchQuery`
- `BookingCreateCommand`
- `ReservationDetailResponse`

피해야 할 예시:

- `DataDto`
- `InfoDto`
- `CommonRequest`
- `TempResponse`

## 테스트 규칙

백엔드 코드를 수정한 뒤에는 가능하면 테스트를 실행합니다.

```bash
./gradlew test
```

Windows 환경에서는 다음 명령어를 사용합니다.

```bash
.\gradlew.bat test
```

비즈니스 로직은 service 계층 테스트를 우선 고려합니다.

API 동작은 controller 테스트 또는 통합 테스트를 고려합니다.

예매, 결제, 좌석 상태 로직을 추가할 때는 성공 케이스뿐 아니라 실패 케이스도 함께 테스트합니다.

## 변경 안전 규칙

공유 구조를 수정하기 전에는 현재 사용처를 먼저 확인합니다.

패키지명, DTO명, endpoint, response field는 프론트엔드와 연결될 수 있으므로 쉽게 변경하지 않습니다.

API 계약이 바뀌는 경우 프론트엔드 영향 범위를 명확히 설명합니다.

작업 범위는 사용자가 요청한 내용에 맞게 제한합니다.

기능 구현 중 관련 없는 도메인을 함께 리팩터링하지 않습니다.

## 현재 기준 구현

`account` 패키지는 현재 계층 구조의 기준 구현입니다.

`auth` 패키지는 일부 계층 구조를 따르지만 security infrastructure 성격도 함께 가집니다.

`concert` 패키지는 현재 뼈대만 있는 상태입니다. 실제 구현 시 위 도메인 구조를 따라 확장합니다.

HTTP 패키지 규칙
request, response 이름의 하위 패키지를 갖는다.
각 패키지 안의 클래스는 각 패키지 이름으로 끝나야 한다.

http 요청이 컨트롤러로 오는 두 가지 경우:
데이터를 요청하는 경우 따로 레코드 클래스를 만들지 않고 스프링부트 웹 라이브러리를 우선적으로 활용하여 컨트롤러 코드를 작성한다.
데이터를 조작하는 경우 request 패키지에 POST, PUT 등 메소드로 오는 요청의 본문을 정의하는 레코드 클래스를 정의한다.

컨트롤러가 http 응답을 반환하는 경우:
response 패키지에 반환하는 데이터 유형을 이름으로 하는 레코드 클래스를 정의한다.


DTO RULE
DTO 패키지는 컨트롤러와 서비스 사이에서 주고받는 데이터를 정의한다.

`query`, `command`, `result` 이름의 하위 패키지를 갖는다.

각 패키지 안의 클래스 또는 레코드는 각 패키지 이름으로 끝나야 한다.

컨트롤러가 서비스로 데이터를 전달하는 경우
컨트롤러는 HTTP 요청 데이터를 그대로 서비스에 넘기지 않고,
서비스가 이해할 수 있는 DTO로 변환하여 전달한다.

데이터를 요청하는 경우
데이터를 조회하거나 검색하는 경우 `query` 패키지에 레코드 클래스를 정의한다.
query는 조회 조건을 표현한다.

다만 조회 조건이 2개 이상이거나, 이후 확장 가능성이 있는 경우 query 클래스를 우선 사용한다.

데이터를 조작하는 경우,
데이터를 생성, 수정, 삭제하거나 상태를 변경하는 경우 command 패키지에 레코드 클래스를 정의한다.
command는 서비스가 수행해야 하는 작업의 입력값을 표현한다.

HTTP request DTO를 서비스에 직접 넘기지 않는다.
컨트롤러에서 request DTO를 command DTO로 변환한 뒤 서비스에 전달한다.

서비스가 컨트롤러 데이터를 반환하는 경우,
서비스가 컨트롤러로 데이터를 반환할 때는 result 패키지에 레코드 클래스를 정의한다.
result는 서비스 처리 결과를 표현한다.
서비스는 HTTP response DTO를 직접 반환하지 않는다.
컨트롤러에서 result DTO를 response DTO로 변환하여 반환한다.

service 계층은 http/request, http/response 패키지에 의존하지 않는다.
controller 계층은 request, response, query, command, result DTO를 조립하고 변환할 수 있다.
entity를 controller로 직접 반환하지 않는다.
entity를 response DTO로 직접 노출하지 않는다.

DTO 이름은 목적과 방향이 드러나야 한다.