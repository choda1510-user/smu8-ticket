import type {ListResponse, PageRequest, PageResponse} from "@/types/api";

export type ReservationStatus = "BEFORE_OPEN" | "OPEN" | "CLOSED"; // 예매 오픈 전, 예매 가능, 예매 종료 상태

export type ConcertSchedule = { //상세페이지 내에 회차정보
    id: number; // 공연 회차 고유 ID
    date: string; // 공연 날짜 (예: "2026-06-24")
    time: string; // 공연 시간 (예: "19:30")
    reservationEndAt: string; // 예매 종료일시
};

export type ConcertDetail = {
    id: number; // 공연 고유 ID
    venueId: number; // 공연장 고유 ID
    posterUrl?: string; // 공연 포스터 이미지 주소
    concertTitle: string; // 화면에 표시할 공연 제목
    concertPeriod: string; // 화면에 표시할 공연 기간
    runningTime: string; // 공연 러닝타임
    venueName: string; // 공연장 이름
    reservationPeriod: string; // 예매 가능 기간
    schedules: ConcertSchedule[]; // 공연 회차 목록
    description?: string; // 공연 설명
    startAt?: string; // 백엔드에서 내려주는 공연 시작일시
    endAt?: string; // 백엔드에서 내려주는 공연 종료일시
    reservationStartAt?: string; // 예매 오픈 시작일시
    reservationStatus?: ReservationStatus; // 예매 버튼과 타이머 표시를 판단할 예매 상태
};

export type ConcertItem = {
    concertId: number; // 화면에서 사용하는 공연 ID
    posterUrl?: string; // 공연 포스터 이미지 주소
    title: string; // 공연 제목
    period: string; // 화면에 표시할 공연 기간
    venueName: string; // 공연장 이름
    badgeText: string; // 화면에 표시할 상태 문구
};

export type ConcertSearchResult = ConcertItem & {
    venueId: number; // 공연장 고유 ID
};

export type ConcertResult = {
    id: number; // 공연 고유 ID
    posterUrl?: string; // 공연 포스터 이미지 주소
    title: string; // 공연 제목
    period: string; // 화면에 표시할 공연 기간
    venueId: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    status: string; // 화면에 표시할 공연 상태
};

export type HomeConcertCard = {
    concertId: number; // 홈 화면에서 사용하는 공연 ID
    posterUrl?: string; // 공연 포스터 이미지 주소
    title: string; // 공연 제목
    reservationPeriod: string; // 예매 기간
    reservationEndDate: string; // 예매 종료일
    badgeText: string; // 화면에 표시할 상태 문구
};

export type ConcertListResponse = ListResponse<ConcertItem>; // 화면용 공연 목록 응답 타입
export type ConcertSearchResultResponse = ListResponse<ConcertSearchResult>; // 화면용 공연 검색 결과 응답 타입
export type ConcertResultResponse = ListResponse<ConcertResult>; // 화면용 공연 결과 목록 응답 타입

export type ConcertListRequest = PageRequest & {
    concert_name?: string; // 공연명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venue_name?: string; // 공연장명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
};

export type ConcertDetailRequest = {
    id: number; // 상세 조회 URL에 path variable로 보낼 공연 고유 ID
};

export type ConcertResponse = {
    id: number; // 공연 고유 ID
    title: string; // 공연 제목
    description: string; // 공연 설명
    notice?: string; // 공연 공지사항
    runningTime: string; // 공연 러닝타임
    startAt: string; // 공연 시작일 : 첫번째 회차 날짜 (백엔드 sessions - date 기준 계산)
    endAt: string; // 공연 종료일 : 마지막 회차 날짜 (백엔드 sessions - date 기준 계산)
    reservationStartAt: string; // 예매 오픈 시작일시, 프론트에서 오픈 1시간 전 타이머 계산 기준으로 사용
    reservationStatus: ReservationStatus; // 예매 버튼 활성화와 타이머 표시를 판단할 예매 상태
    venueId: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    schedules: ConcertSchedule[]; // 공연 회차 목록
    createdAt?: string; // 공연 데이터 생성일시
    updatedAt?: string; // 공연 데이터 수정일시
};

export type ConcertPageResponse = PageResponse<ConcertResponse>; // 사용자 공연 목록 조회 API의 페이지 응답 타입

export type {
    AdminConcertCreateRequest,
    AdminConcertDeleteRequest,
    AdminConcertDetailRequest,
    AdminConcertImageRequest,
    AdminConcertListRequest,
    AdminConcertListResponse,
    AdminConcertRequest,
    AdminConcertResponse,
    AdminConcertSeatPolicyRequest,
    AdminConcertSeatRequest,
    AdminConcertSeatTypeRequest,
    AdminConcertUpdateRequest,
} from "@/types/adminConcert";
