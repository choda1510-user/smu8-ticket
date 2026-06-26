import type { PageRequest, PageResponse, PageResult } from "./api";
// ~Response 백엔드에서 받아올 응답 타입
// ~Result 프론트가 사용할 형태로 가공한 타입


// 사용자 공연장 검색 목록 페이지가 쓸 타입
export type VenueItemResponse = {
    id: number; // 화면에서 사용하는 공연장 고유 ID
    name: string; // 공연장 이름
    availableConcertCount: number; // 해당 공연장에서 예매 가능한 공연 개수
};

export type VenueSearch = {
    id: number; // 공연장 고유 ID
    venueName: string; // 공연장 이름
    availableConcertCount: number; // 해당 공연장에서 예매 가능한 공연 개수
};

export type VenueItemPageResponse = PageResponse<VenueItemResponse>; // 화면용 공연장 검색 결과 응답 타입
export type VenueSearchPageResult = PageResult<VenueSearch>; // 화면용 공연장 결과 목록 응답 타입

export type VenuePageRequest = PageRequest & {
    venueCode?: string; // 공연장 코드로 검색할 때 URL 경로 파라미터로 보낼 값
    venueName?: string; // 공연장명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
};
// 여기까지
