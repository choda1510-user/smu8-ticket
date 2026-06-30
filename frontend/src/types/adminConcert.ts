import type { PageRequest, PageResponse, PageResult } from "@/types/api";
import type { ReservationStatus, SeatGradeResponse, SeatResponse } from "@/types/concert";

// request -> 프론트가 백엔드에게 보내는 요청 본문 타입
// parameters -> 프론트가 백엔드에게 보내는 요청 쿼리 스트링
// pathVariables -> 프론트가 백엔드에게 보내는 요청 경로 변수
// query -> 이벤트 핸들러가 Api 함수에게 전달하는 조회 요청 타입
// command -> 이벤트 핸들러가 Api 함수에게 전달하는 작업 요청 타입
// 관리자 공연 목록 검색 요청 타입
export type AdminConcertListPageParameters = PageRequest & {
    concertName?: string; // 공연명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
    concertCode?: string; // 공연코드로 검색할 때 URL 경로 파라미터로 보낼 값
    venueName?: string; // 공연장명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venueCode?: string; // 공연장코드로 검색할 때 URL 쿼리 파라미터로 보낼 값
    reservationStatus?: ReservationStatus; // 예매 상태로 검색할 때 URL 쿼리 파라미터로 보낼 값
};
// 
export type AdminConcertListPageQuery = {
    querys: AdminConcertListPageParameters
};

// 관리자 공연 상세 조회 요청 타입
export type AdminConcertDetailQuery = {
    pathVariables: {
        id: number; // 상세 조회 URL에 path variable로 보낼 공연 고유 ID
    }
};

// 관리자 공연 삭제 요청 타입
export type AdminConcertDeleteRequest = {
    pathVariables: {
        id: number; // 삭제 URL에 path variable로 보낼 공연 고유 ID
    }
};

// 관리자 공연 좌석 타입 요청 타입
export type AdminSeatGradeCreateRequest = {
    gradeName: string; // 좌석 타입 이름
    price: number; // 좌석 가격
    color: string; // 좌석 타입 색 (예: #fafafa)
};

// 관리자 공연 회차 등록 요청 타입
export type AdminConcertScheduleCreateRequest = {
    date: string; // 공연 날짜
    reservationEndAt: string; // 예매 종료 날짜
}
// 관리자 좌석 등록 요청 타입
export type AdminSeatCreateRequest = {
    seatGradeName: string; // 좌석 타입 이름
    row: number; // 좌석 행 위치
    col: number; // 좌석 열 위치
}
// 관리자 공연 등록 요청 타입
export type AdminConcertCreateRequest = {
    title: string; // 공연 제목
    description: string; // 공연 설명
    runningTime: string; // 공연 시간
    reservationStartAt?: string; // 예매 시작일시
    venueId: number; // 공연장 고유 ID
    notice?: string; // 공지사항
    seatGrades: AdminSeatGradeCreateRequest[]; // 좌석 종류 목록
    schedules: AdminConcertScheduleCreateRequest[]; // 공연 회차 목록
    seats: AdminSeatCreateRequest[]; // 좌석 목록
    rowMax: number; // 행 개수
    colMax: number; // 열 개수
};
// 관리자 공연 이미지 등록 작업 타입
export type AdminConcertPostersCommand = {
    cardPoster: File;
    bannerPoster: File;
    descriptionPoster: File;
}
// 관리자 공연 등록 작업 타입
export type AdminConcertCreateCommand = AdminConcertPostersCommand & {
    request: AdminConcertCreateRequest;
}

// 관리자 공연 수정 요청 타입
export type AdminConcertUpdateRequest = {
    title: string; // 공연명
    runningTime: string; // 공연 시간
    reservationStartAt?: string; // 예매 시작일시
    venueId: number; // 공연장 고유 ID
    notice?: string; // 공지사항
    description: string; // 작품 설명
};
export type AdminConcertUpdateCommand = {
    request: AdminConcertUpdateRequest;
    pathVariables: {
        id: string
    }
}
// 관리자 공연 기본정보 수정 요청 타입 (제목/설명/러닝타임만, 포스터/일정/좌석 변경 없음)
export type AdminConcertUpdateScheduleRequest = {
    id: number | null; // 기존 회차면 서버 ID, 새 회차면 null
    date: string;
    reservationEndAt: string;
};

export type AdminConcertUpdateSeatGradeRequest = {
    id: number | null; // 기존 등급이면 서버 ID, 새 등급이면 null
    gradeName: string;
    price: number;
    color: string;
};

export type AdminConcertUpdateSeatRequest = {
    seatGradeName: string;
    row: number;
    col: number;
};

export type AdminConcertUpdateBasicInfoRequest = {
    title: string; // 공연명
    description: string; // 작품 설명
    runningTime: string; // 공연 시간
    schedules: AdminConcertUpdateScheduleRequest[];
    seatGrades: AdminConcertUpdateSeatGradeRequest[];
    seats: AdminConcertUpdateSeatRequest[];
    rowMax: number;
    colMax: number;
};
export type AdminConcertUpdateBasicInfoCommand = {
    request: AdminConcertUpdateBasicInfoRequest;
    cardPoster?: File; // 새로 선택한 카드형 포스터 (선택하지 않으면 기존 유지)
    bannerPoster?: File; // 새로 선택한 스크린형 포스터 (선택하지 않으면 기존 유지)
    descriptionPoster?: File; // 새로 선택한 작품설명 이미지 (선택하지 않으면 기존 유지)
    pathVariables: {
        id: string;
    };
};

// 기존 등록 코드 호환용 관리자 공연 요청 타입
export type AdminConcertRequest = AdminConcertCreateRequest;

// 백엔드에서 받아오는 공연 회차 응답 타입
export type AdminConcertScheduleResponse = {
    id: number; // 회차 고유 ID
    concertId: number; // 공연 고유 Id
    date: string // 공연 날짜
    reservationEndAt: string; // 예매 마감일시
};

// 백엔드에서 받아오는 관리자 공연 응답 타입
export type AdminConcertDetailResponse = {
    id: number; // 공연 고유 ID
    concertCode: string; // 공연 코드
    title: string; // 공연 제목
    description: string; // 공연 설명
    cardPosterUrl: string; // 카드형 메인 포스터 이미지 주소
    bannerPosterUrl: string; // 스크린형 포스터 이미지 주소
    descriptionPosterUrl: string; // 작품 설명 이미지 주소
    runningTime: string; // 공연 러닝타임
    schedules: AdminConcertScheduleResponse[]; // 회차 목록
    seatGrades: SeatGradeResponse[]; // 좌석 등급 목록
    seats: SeatResponse[]; // 좌석 목록
    reservationStartAt?: string; // 예매 시작일시
    reservationStatus: ReservationStatus; // 예매 상태
    venueId: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    notice?: string; // 공지사항
    rowMax: number, // 좌석 행 개수
    colMax: number, // 좌석 열 개수
    totalSeatCount?: number; // 해당 공연 총 좌석수
    reservedSeatCount?: number; // 예매완료 총 좌석수
    createdAt?: string; // 생성일시
    updatedAt?: string; // 수정일시
};

// 관리자 공연 목록의 각 항목 타입
export type AdminConcertItem = {
    id: number; // 공연 고유 ID
    concertCode: string; // 공연 코드
    title: string; // 공연명
    periodText: string; // 공연 기간 표시 텍스트
    venueCode?: string; // 공연장 코드
    venueName: string; // 공연장 이름
    reservationStatus: ReservationStatus; // 예매 상태
    createdAt?: string; // 생성일시
    updatedAt?: string; // 수정일시
};

// 프론트에서 사용할 공연 회차 타입
export type AdminConcertSessionResult = {
    id: number; // 회차 고유 ID
    concertId: number; // 공연 고유 ID
    date: string; // 공연 날짜
    time: string; // 공연 시간
    reservationEndAt: string; // 예매 마감일시
};

// 프론트에서 사용할 공연 이미지 타입
export type AdminConcertImageResult = {
    cardPosterUrl?: string; // 카드형 메인 포스터 이미지 주소
    screenPosterUrl?: string; // 스크린형 포스터 이미지 주소
    descriptionImageUrl?: string; // 작품 설명 이미지 주소
};

// 프론트에서 사용할 좌석 타입
export type AdminConcertSeatTypeResult = {
    seatTypeId: string; // 좌석 타입 ID
    seatTypeName: string; // 좌석 타입 이름
    price: number; // 좌석 가격
};

// 프론트에서 사용할 좌석 배치 타입
export type AdminConcertSeatResult = {
    rowIndex: number; // 좌석 행 위치
    columnIndex: number; // 좌석 열 위치
    seatTypeId: string; // 좌석 타입 ID
};

// 프론트에서 사용할 좌석/가격 정책 타입
export type AdminConcertSeatPolicyResult = {
    rowCount: number; // 전체 좌석 행 개수
    columnCount: number; // 전체 좌석 열 개수
    seatTypes: AdminConcertSeatTypeResult[]; // 좌석 타입 목록
    seats: AdminConcertSeatResult[]; // 좌석 배치 목록
};

// 관리자 공연 상세 페이지 타입
export type AdminConcertDetails = {
    id: number; // 공연 고유 ID
    concertCode: string; // 공연 코드
    title: string; // 공연명
    runningTime: string; // 공연 시간
    reservationStartAt?: string; // 예매 시작일시
    reservationStatus: ReservationStatus; // 예매 상태
    venueId: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    venueCode?: string; // 공연장 코드
    notice?: string; // 공지사항
    description: string; // 작품 설명
    sessions: AdminConcertSessionResult[]; // 회차 목록
    images?: AdminConcertImageResult; // 이미지 정보
    seatPolicy?: AdminConcertSeatPolicyResult; // 좌석/가격 정책
    createdAt?: string; // 생성일시
    updatedAt?: string; // 수정일시
};

// 관리자 공연 목록 조회 API의 페이지 응답 타입
export type AdminConcertListPageResponse =
    PageResponse<AdminConcertDetailResponse>;

// 관리자 공연 목록 화면에서 사용할 페이지 결과 타입
export type AdminConcertListPageResult =
    PageResult<AdminConcertItem>;

// 관리자 공연 등록 API 응답 타입
export type AdminConcertCreateResponse = {
    id: number; // 등록된 공연 고유 ID
};

// 관리자 공연 수정 API 응답 타입
export type AdminConcertUpdateResponse = {
    id: number; // 수정된 공연 고유 ID
};

// 관리자 공연 삭제 API 응답 타입
export type AdminConcertDeleteResponse = Record<string, never>;
