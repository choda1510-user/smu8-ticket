import type {ListResponse, PageRequest, PageResponse} from "@/types/api";
import type {ConcertResponse} from "@/types/concert";

export type VenueSearchResult = {
    venueId: number; // 화면에서 사용하는 공연장 고유 ID
    venueName: string; // 공연장 이름
    availableConcertCount: number; // 해당 공연장에서 예매 가능한 공연 개수
};

export type VenueResult = {
    id: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    availableConcertCount: number; // 해당 공연장에서 예매 가능한 공연 개수
};

export type VenueSearchResultResponse = ListResponse<VenueSearchResult>; // 화면용 공연장 검색 결과 응답 타입
export type VenueResultResponse = ListResponse<VenueResult>; // 화면용 공연장 결과 목록 응답 타입

export type VenueListRequest = PageRequest & {
    venue_code?: string; // 공연장 코드로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venue_name?: string; // 공연장명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
};

export type VenueDetailRequest = {
    id: number; // 상세 조회 URL에 path variable로 보낼 공연장 고유 ID
};

export type VenueResponse = {
    id: number; // 공연장 고유 ID
    venue_code: string; // 난수로 생성된 공연장 코드
    venue_name: string; // 공연장 이름
    address: string; // 카카오 주소 조회 API로 선택한 공연장 주소
    current_concerts?: ConcertResponse[]; // 현재 해당 공연장에 등록되어 있는 공연 목록
};

export type VenuePageResponse = PageResponse<VenueResponse>; // 사용자 공연장 목록 조회 API의 페이지 응답 타입
export type VenueDetailResponse = VenueResponse; // 사용자 공연장 상세 조회 API의 응답 타입

export type BackendVenue = VenueResponse & {
    name?: string; // 기존 API 코드 호환용 공연장 이름
    roadAddress?: string; // 기존 API 코드 호환용 도로명 주소
    detailAddress?: string; // 기존 API 코드 호환용 상세 주소
    jibunAddress?: string; // 기존 API 코드 호환용 지번 주소
    buildingName?: string; // 기존 API 코드 호환용 건물명
    zoneNo?: string; // 기존 API 코드 호환용 우편번호
    createdAt?: string; // 기존 API 코드 호환용 생성일시
    updatedAt?: string; // 기존 API 코드 호환용 수정일시
};

export type BackendVenueListResponse = Partial<VenuePageResponse> & {
    venues?: BackendVenue[]; // 공연장 목록 응답에서 사용할 공연장 목록
    contents?: BackendVenue[]; // 공통 페이지 응답에서 사용할 공연장 목록
};

export type {
    AdminVenueCreateRequest,
    AdminVenueDeleteRequest,
    AdminVenueDetailRequest,
    AdminVenueListRequest,
    AdminVenueListResponse,
    AdminVenueRequest,
    AdminVenueResponse,
    AdminVenueUpdateRequest,
} from "@/types/adminVenue";
