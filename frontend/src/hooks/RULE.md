# Hooks Coding Rules

이 디렉토리는 React Custom Hook을 관리하는 공간입니다.

컴포넌트에서 반복되는 상태 관리, API 호출, 이벤트 처리, 브라우저 기능 접근 로직은 이곳의 Hook으로 분리합니다.

## 1. 파일 이름 규칙

Custom Hook 파일은 반드시 `use`로 시작하고 camelCase를 사용합니다.

## 2. 함수 이름 규칙

파일 이름과 Hook 함수 이름은 동일하게 맞추고 default export를 사용합니다.

## 3. Hook 내부 책임 범위

Hook은 하나의 명확한 책임만 가집니다.

하나의 Hook이 너무 많은 상태와 함수를 가지면 여러 Hook으로 분리합니다.

## 4. 컴포넌트 UI 로직과 분리

Hook에는 JSX를 작성하지 않습니다.

## 5. 반환값 규칙

반환값이 2개 이하이고 순서가 명확하면 배열을 사용할 수 있습니다.

반환값이 3개 이상이거나 의미가 중요한 경우 객체를 사용합니다.

프로젝트에서는 가독성을 위해 객체 반환을 우선 사용합니다.

## 6. 타입 정의 규칙

Hook의 props와 return 타입은 반드시 `@/src/types`에 있는 타입을 사용합니다.
알맞은 타입이 없는 경우 작업을 중지하고 문제의 원인을 보고합니다.

## 7. API 호출 Hook 규칙
Hook의 API 호출은 `@/src/apis`안에 있는 함수를 사용합니다.
알맞은 타입이 없는 경우 작업을 중지하고 문제의 원인을 보고합니다.

## 8. useEffect 사용 규칙

`useEffect`의 dependency array는 의도적으로 작성합니다.

dependency를 비우는 경우에는 왜 비웠는지 주석으로 설명합니다.

## 9. 디렉토리 구조

Hook이 많아지면 도메인별로 분리합니다.

공통 Hook은 `@/src/hooks` 루트에 둡니다.
특정 도메인에서만 사용하는 Hook은 해당 도메인 하위 디렉토리에 둡니다.

## 10. 금지 사항

다음 코드는 작성하지 않습니다.

```ts
// Hook 이름이 use로 시작하지 않음
export function modalState() {}

// Hook 내부에서 조건부로 다른 Hook 호출
if (isLoggedIn) {
  useEffect(() => {}, [])
}

// 너무 많은 책임을 가진 Hook
export function useMainPageEverything() {}
```

Hook은 React의 Rules of Hooks를 반드시 지켜야 합니다.

## 11. PR 체크리스트

Hook을 추가하거나 수정할 때는 다음을 확인합니다.

* Hook 이름이 `use`로 시작하는가?
* 하나의 책임만 가지는가?
* JSX를 반환하지 않는가?
* 반환값의 의미가 명확한가?
* TypeScript 타입이 `@/src/types`안에 존재하는 타입인가?
* `useEffect` dependency가 올바른가?
* 컴포넌트에서 중복되던 로직이 Hook으로 적절히 분리되었는가?
