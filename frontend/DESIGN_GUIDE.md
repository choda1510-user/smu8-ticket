# K-POP Ticket Design Guide

이 문서는 제공된 K-POP LIVE 티켓 서비스 레퍼런스 이미지를 기준으로 `frontend` UI를 설계하거나 수정할 때 사용하는 디자인 가이드입니다.

## Design Mood

- 전체 분위기는 프리미엄 K-POP 티켓 플랫폼입니다. (SM 엔터테인먼트 컨셉)
- 키워드는 `dark navy`, `soft pink`, `white card`, `concert energy`, `clean booking flow`입니다.
- 강한 콘서트 이미지와 차분한 예매 UI가 함께 보여야 합니다.
- 배경은 어둡고 무대감 있게, 실제 정보 영역은 흰 카드로 정돈합니다.
- 장식은 과하지 않게 쓰고, CTA와 티켓 관련 정보만 분홍색으로 강조합니다.

## Color System

```css
:root {
    --color-navy-900: #071120;
    --color-navy-800: #101b2c;
    --color-navy-700: #233154;

    --color-pink-500: #f47fa6;
    --color-pink-400: #ff9fbd;
    --color-pink-300: #ffc8d9;
    --color-pink-100: #fff0f5;

    --color-white: #ffffff;
    --color-gray-900: #111827;
    --color-gray-700: #374151;
    --color-gray-500: #6b7280;
    --color-gray-300: #e3e5ec;
    --color-gray-100: #f7f8fb;
}
```

### Color Usage

- Header/Footer: `--color-navy-900` 또는 `--color-navy-800`
- Primary CTA: navy fill + white text
- Secondary CTA: white fill + pink border/text
- Accent: pink gradient, pink badge, pink focus ring
- Card border: light gray `--color-gray-300`
- Section background: white or very light pink
- Body text: gray-900
- Metadata text: gray-500

## Typography

- 기본 폰트는 얇은 고딕 계열을 사용합니다.

```css
font-family: "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif;
```

- 기본 본문 굵기: `300`
- 카드 제목/섹션 제목: `400-500`
- CTA 버튼: `500`
- 과도한 `700-900` 굵기는 피합니다.
- 영문 메뉴는 작고 정돈된 느낌으로 사용합니다.
- 한글 본문은 줄간격을 넉넉하게 둡니다.

## Layout Principles

- 전체 페이지는 최대 폭을 제한하고 중앙 정렬합니다.
- 상단 헤더는 풀폭 navy 바 형태로 둡니다.
- 주요 콘텐츠는 흰색 카드와 부드러운 그림자로 분리합니다.
- 카드 간 간격은 충분히 두어 복잡한 정보를 숨 쉬게 합니다.
- 검색/필터/예매 같은 기능 UI는 한 줄 또는 카드형 툴바로 묶습니다.
- 모바일에서는 1열 흐름으로 자연스럽게 쌓이게 합니다.

## Spacing

```css
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-20: 20px;
--space-24: 24px;
--space-32: 32px;
--space-40: 40px;
--space-56: 56px;
```

- 카드 내부 padding: `24px-32px`
- 섹션 간격: `32px-56px`
- 버튼 내부 좌우 padding: `16px-24px`
- 리스트 카드 gap: `20px-24px`

## Border & Radius

- 기본 외곽선은 연회색을 사용합니다.
- 강조 컴포넌트만 연분홍 border를 사용합니다.
- 카드 radius는 `12px-20px` 사이로 둡니다.
- 검색창, badge, chip, tab은 pill 형태를 사용합니다.

```css
border: 1px solid #e3e5ec;
border-radius: 16px;
```

## Shadow

그림자는 부드럽고 넓게 사용합니다.

```css
box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
```

- 카드 그림자는 옅게 사용합니다.
- CTA hover에는 살짝 강한 그림자를 허용합니다.
- 딱딱한 offset shadow는 피합니다.

## Header

### Structure

- 좌측: 로고
- 중앙/우측: 검색창
- 검색창 하단 좌측: 주요 카테고리
- 우측 상단: 로그인/회원가입 또는 마이페이지

### Style

- 배경은 짙은 navy
- 텍스트는 white 또는 white 70%
- 포인트는 soft pink
- 검색창은 투명한 navy overlay + pink border
- 검색 아이콘은 검색창 border 색과 동일하게 맞춥니다.

## Hero / Main Visual

- 콘서트 이미지는 밝은 핑크 조명, 무대, 관객 실루엣 중심으로 사용합니다.
- 텍스트는 왼쪽 정렬이 가장 안정적입니다.
- 핵심 문구는 크게, CTA는 바로 아래에 둡니다.
- 이미지 위에 텍스트를 올릴 때는 흰색 또는 navy 계열을 사용하고 가독성을 우선합니다.

## Search & Quick Booking

- 검색/필터 영역은 흰색 floating card로 만듭니다.
- card 내부는 label + input/select 형태로 정돈합니다.
- 검색 버튼은 navy fill로 강조합니다.
- label은 작고 옅게, 입력값은 또렷하게 보여야 합니다.

## Concert Card

### Structure

- Poster image
- Badge: NEW, HOT, SOLD OUT 등
- Concert title
- Venue
- Date/time
- Booking button

### Style

- 카드 배경: white
- border: light gray
- radius: 12px-16px
- poster는 상단 고정 비율
- 버튼은 white + pink border, hover 시 pink tint

```css
.concert-card {
    border: 1px solid #e3e5ec;
    border-radius: 14px;
    background: #fff;
    overflow: hidden;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
}
```

## Booking CTA

- 가장 중요한 예매 버튼은 navy fill을 사용합니다.
- 카드 내부 보조 예매 버튼은 pink outline을 사용할 수 있습니다.
- CTA 텍스트는 짧고 명확해야 합니다.

```css
.primary-button {
    border: 2px solid #071120;
    border-radius: 8px;
    background: #071120;
    color: #fff;
}
```

## Event Banner

- 배너는 navy gradient + pink visual accent 조합을 사용합니다.
- 아이콘은 단색 line icon을 사용합니다.
- 오른쪽 CTA는 pink fill 또는 white fill을 사용합니다.
- 텍스트 대비가 충분해야 합니다.

## Seat Preview

- 좌석 등급은 pink 계열과 gray 계열로 구분합니다.
- VIP/R/S/A 등급은 색상뿐 아니라 label도 함께 표시합니다.
- 무대 영역은 dark navy 또는 charcoal로 표시합니다.
- 좌석표는 실제 예매 기능보다 안내 역할이므로 과도하게 복잡하게 만들지 않습니다.

## Info Panels

- 공지사항, FAQ, 고객센터는 3열 또는 2열 카드로 구성합니다.
- 텍스트는 작고 정돈되게, 날짜는 오른쪽 또는 muted color로 둡니다.
- 고객센터 전화번호처럼 중요한 정보는 크게 표시합니다.

## Footer

- footer는 header와 같은 navy 계열을 사용합니다.
- 로고, 약관 링크, 회사 정보, SNS 아이콘을 정돈합니다.
- 텍스트 대비는 너무 강하지 않게 white 60-80%를 사용합니다.

## Interaction

- Hover: 살짝 밝아지거나 위로 `1px` 이동
- Focus: pink focus ring
- Active: navy fill 또는 underline
- Disabled: gray background + gray text

```css
:focus-visible {
    outline: 3px solid rgba(255, 159, 189, 0.45);
    outline-offset: 2px;
}
```

## Responsive Rules

- Desktop: 4-column card grid 가능
- Tablet: 2-column card grid
- Mobile: 1-column stack
- Header는 모바일에서 logo, search, nav 순서로 세로 배치합니다.
- Quick booking form은 모바일에서 모든 input을 세로로 쌓습니다.

## Do

- navy와 pink의 대비를 명확히 사용합니다.
- 카드 기반으로 정보를 정돈합니다.
- CTA는 한 화면에서 가장 먼저 보이게 합니다.
- 콘서트 이미지의 감성은 유지하되 UI는 깨끗하게 정리합니다.
- 긴 텍스트는 `overflow-wrap`과 `word-break`로 안전하게 처리합니다.

## Do Not

- 보라/핑크 그라데이션을 과하게 쓰지 않습니다.
- 카드 안에 또 다른 큰 카드를 중첩하지 않습니다.
- 모든 요소에 굵은 폰트를 쓰지 않습니다.
- 검정 테두리를 남발하지 않습니다.
- CTA가 여러 개 동시에 같은 강도로 보이게 하지 않습니다.

## Current Project Application

- `UserHeader`: navy full-width header, pink search accent, thin Gothic typography
- `ConcertDetailsPage`: soft card, pink/navy accent, light gray borders, rounded sections
- `ConcertListPage`: card grid + pink outline booking button 권장
- `HomePage`: hero + quick booking + concert card sections 구조 권장

## CSS Token Recommendation

공통 스타일을 늘릴 경우 `frontend/src/index.css` 또는 별도 global CSS에 아래 토큰을 추가하는 것을 권장합니다.

```css
:root {
    --ticket-navy: #071120;
    --ticket-navy-soft: #233154;
    --ticket-pink: #f47fa6;
    --ticket-pink-soft: #ffd4e5;
    --ticket-pink-bg: #fff0f5;
    --ticket-border: #e3e5ec;
    --ticket-text: #111827;
    --ticket-muted: #6b7280;
    --ticket-card-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}
```
