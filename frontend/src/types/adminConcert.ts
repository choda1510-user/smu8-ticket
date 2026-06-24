import type {PageRequest, PageResponse} from "@/types/api";
import type {ReservationStatus} from "@/types/concert";

export type AdminConcertListRequest = PageRequest & {
    concert_name?: string; // 관리자 공연 목록에서 공연명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
    concert_code?: string; // 관리자 공연 목록에서 공연코드로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venue_name?: string; // 관리자 공연 목록에서 공연장명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venue_code?: string; // 관리자 공연 목록에서 공연장코드로 검색할 때 URL 쿼리 파라미터로 보낼 값
};

export type AdminConcertDetailRequest = {
    id: number; // 상세 조회 URL에 path variable로 보낼 공연 고유 ID
};

export type AdminConcertSeatTypeRequest = {
    seat_type_id: string; // 좌석 배치에서 좌석 타입을 구분하기 위해 프론트가 임시로 사용하는 ID
    seat_type_name: string; // 등록 요청 body에 담아 보낼 좌석 타입 이름
    price: number; // 등록 요청 body에 담아 보낼 해당 좌석 타입 가격
};

export type AdminConcertSeatRequest = {
    row_index: number; // 좌석 배치에서 행 위치
    column_index: number; // 좌석 배치에서 열 위치
    seat_type_id: string; // 이 좌석에 적용된 좌석 타입 ID
};

export type AdminConcertSeatPolicyRequest = {
    row_count: number; // 전체 좌석 행 개수
    column_count: number; // 전체 좌석 열 개수
    seat_types: AdminConcertSeatTypeRequest[]; // 좌석 타입과 가격 목록
    seats: AdminConcertSeatRequest[]; // 실제 생성된 좌석 배치 목록, 통로/삭제 영역은 보내지 않음
};

export type AdminConcertImageRequest = {
    card_poster_url?: string; // 사용자 카드/검색 결과에 사용할 공연 포스터 이미지 주소
    screen_poster_url?: string; // 메인 배너나 큰 화면에 사용할 공연 이미지 주소
    description_image_url?: string; // 작품 설명 영역에 추가할 이미지 주소
};

export type AdminConcertCreateRequest = {
    title: string; // 등록 요청 body에 담아 보낼 공연 제목
    description: string; // 등록 요청 body에 담아 보낼 공연 설명
    notice?: string; // 등록 요청 body에 담아 보낼 공연 공지사항
    runningTime: string; // 등록 요청 body에 담아 보낼 공연 running time
    reservationStartAt?: string; // 등록 요청 body에 담아 보낼 예매 오픈 시작일시
    venueId: number; // 등록 요청 body에 담아 보낼 공연장 고유 ID
    sessions: AdminConcertSession[]; // 등록 요청 body에 담아 보낼 회차 목록
    images?: AdminConcertImageRequest; // 등록 요청 body에 담아 보낼 공연 이미지 정보
    seat_policy?: AdminConcertSeatPolicyRequest; // 등록 요청 body에 담아 보낼 좌석/가격 정책
};

export type AdminConcertUpdateRequest = AdminConcertDetailRequest & {
    title: string; // 수정 요청 body에 담아 보낼 공연 제목
    description: string; // 수정 요청 body에 담아 보낼 공연 설명
    notice?: string; // 수정 요청 body에 담아 보낼 공연 공지사항
    runningTime: string; // 수정 요청 body에 담아 보낼 공연 running time
    reservationStartAt?: string; // 수정 요청 body에 담아 보낼 예매 오픈 시작일시
    venueId: number; // 수정 요청 body에 담아 보낼 공연장 고유 ID
    sessions: AdminConcertSession[];
    images?: AdminConcertImageRequest; // 수정 요청 body에 담아 보낼 공연 이미지 정보
    seat_policy?: AdminConcertSeatPolicyRequest; // 수정 요청 body에 담아 보낼 좌석/가격 정책
};

export type AdminConcertDeleteRequest = {
    id: number; // 삭제 URL에 path variable로 보낼 공연 고유 ID
};

export type AdminConcertRequest = AdminConcertCreateRequest; // 기존 등록/수정 코드 호환용 관리자 공연 요청 타입

export type AdminConcertSession = {
    id: number; //회차 고유 ID (1부터 시작, 표시 시 "001" 포맷팅)
    concertId: number; // 공연 고유 ID (부모키 받기 / DB auto increment)
    date: string; // 회차 공연 시작 날짜 (예: "2026-06-24")
    time: string; // 회차 공연 시작 시간 (예: "19:30")
    reservationEndAt: string; // 예매 종료일시 (디폴트 : date D-1)
}

export type AdminConcertResponse = {
    id: number; // 공연 고유 ID (DB auto increment)
    concert_code: string; // 프론트에 보여질 공연 코드 난수 6자리 공연 코드
    title: string; // 공연 제목
    notice?: string; // 공연 공지사항
    description: string; // 공연 설명
    runningTime: string; // 공연 running time
    reservationStartAt: string; // 전 회차 공통 예매 오픈 시작일시
    reservationStatus: ReservationStatus; // 예매 버튼과 타이머 표시를 판단할 예매 상태
    venueId: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    sessions: AdminConcertSession[];
    images?: AdminConcertImageRequest; // 공연에 등록된 이미지 정보
    seat_policy?: AdminConcertSeatPolicyRequest; // 공연에 등록된 좌석/가격 정책
    createdAt?: string; // 공연 데이터 생성일시
    updatedAt?: string; // 공연 데이터 수정일시
};
export type AdminConcertUpdateResponse = {}

export type AdminConcertListResponse = PageResponse<AdminConcertResponse>; // 관리자 공연 목록 조회 API의 페이지 응답 타입
