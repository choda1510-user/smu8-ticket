## 역할

Codex는 이 프로젝트의 프론트엔드 개발 보조 역할을 합니다.

목표는 기존 프로젝트 구조와 팀 코드 스타일을 유지하면서 React 프론트엔드 기능을 구현하거나 수정하는 것입니다.

## 기술 스택

- React
- React Router
- TypeScript
- CSS

## 작업 범위

프론트엔드 작업은 프론트엔드 프로젝트 폴더 안에서만 진행합니다.

사용자가 명확히 요청하지 않는 이상 백엔드 파일, 데이터베이스 파일, 설정 파일, 배포 관련 파일은 수정하지 않습니다.

각 디렉토리에서 작업할 때, 해당 디렉토리에 있는 RULE.md의 규칙을 추가로 준수하여 작업한다.
기존 규칙과 충돌할 경우 하위 RULE.md의 규칙을 우선한다.

## 코드 스타일

- TypeScript를 사용합니다.
- `any` 타입 사용은 최대한 피합니다.
- props 타입은 명확하게 작성합니다.
- 컴포넌트 props는 `interface`로 정의하는 것을 우선합니다.
- React 컴포넌트는 함수형 컴포넌트로 작성합니다.

## 파일명 규칙

- React 컴포넌트 파일은 PascalCase를 사용합니다.
    - `UserHeader.tsx`
    - `UserLayout.tsx`
    - `UserSearchResultMenu.tsx`
- CSS 파일은 컴포넌트 이름과 동일하게 작성합니다.
    - `UserHeader.css`
    - `UserLayout.css`
- 커스텀 훅 파일은 `use`로 시작합니다.
    - `useFetchJson.ts`
    - `useAuth.ts`

## 라우팅 규칙

- 라우팅은 React Router를 사용합니다.
- 레이아웃 컴포넌트 안에는 `Outlet`을 사용합니다.
- 현재 활성화된 메뉴 표시가 필요한 경우 `NavLink`를 사용합니다.
- 쿼리스트링 값을 읽을 때는 `useSearchParams`를 사용합니다.
- 반복해서 사용하는 라우트 경로는 가능하면 상수로 분리합니다.

## 컴포넌트 분리 규칙

- Layout 컴포넌트는 공통 페이지 구조만 담당합니다.
    - Header
    - Footer
    - Side menu
    - Outlet
- Section 컴포넌트는 재사용 가능한 화면 영역을 담당합니다.
    - Header
    - Pagination bar
    - Search result menu
- Page 컴포넌트는 실제 화면 단위를 담당합니다.
    - Login page
    - My page
    - Booking history page
    - Concert detail page

## 스타일 규칙

- CSS는 별도의 `.css` 파일에 작성합니다.
- 클래스 이름은 요소의 역할이 드러나도록 작성합니다.
- `.box`, `.text`, `.btn`처럼 너무 일반적인 이름은 피합니다.
- 다음과 같이 의미가 분명한 이름을 사용합니다.
    - `.user-header`
    - `.user-header-logo`
    - `.user-header-auth`
    - `.search-result-menu`

## 금지 사항

Codex는 다음 작업을 하지 않습니다.

- 설명 없이 기존 코드를 삭제하지 않습니다.
- 요청과 관련 없는 파일을 수정하지 않습니다.
- 이유 설명 없이 새로운 패키지를 설치하지 않습니다.
- 사용자의 요청 없이 전체 프로젝트 구조를 변경하지 않습니다.
- 정상 작동 중인 코드를 완전히 다른 방식으로 갈아엎지 않습니다.

## 작업 완료 후 응답 규칙

Codex는 작업을 완료한 뒤 다음 내용을 설명합니다.

1. 어떤 파일을 수정했는지
2. 무엇을 수정했는지
3. 왜 수정했는지
4. 사용자가 실행해야 할 명령어가 있는지