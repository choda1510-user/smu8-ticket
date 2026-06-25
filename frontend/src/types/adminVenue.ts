import type { PageResponse, PageResult } from "./api";

export type AdminVenueCreateRequest = {
    venue_code: string; // 등록 요청 body에 담아 보낼 난수 공연장 코드
    venue_name: string; // 등록 요청 body에 담아 보낼 공연장 이름
    address: string; // 등록 요청 body에 담아 보낼 카카오 주소 조회 API 선택 주소
};

export type AdminVenueUpdateRequest = {
    venue_name: string; // 수정 요청 body에 담아 보낼 공연장 이름
    address: string; // 수정 요청 body에 담아 보낼 공연장 주소
};

export type AdminVenueDeleteRequest = {
    id: number; // 삭제 URL에 path variable로 보낼 공연장 고유 ID
};

export type AdminVenueRequest = AdminVenueCreateRequest; // 기존 등록 코드 호환용 관리자 공연장 요청 타입

export type AdminVenueItemResponse = {
    id: number; // 공연장 고유 ID
    venue_code: string; // 난수로 생성된 공연장 코드
    venue_name: string; // 공연장 이름
    zoneNo: string; // 구역번호
    roadAddress: string; // 도로 주소
    jibunAddress: string; // 지번 주소
    detailAddress: string; // 세부 주소
    buildingName: string; // 건물 이름
};
export type AdminVenueItem = {
    id: number; // 공연장 고유 ID
    venue_code: string; // 난수로 생성된 공연장 코드
    venue_name: string; // 공연장 이름
    address: string; // 공연장 주소
}

export type AdminVenuePageResponse = PageResponse<AdminVenueItemResponse>; // 관리자 공연장 목록 조회 API의 백엔드 응답 타입
export type AdminVenuePageResult = PageResult<AdminVenueItem>;  // 관리자 공연장 목록 페이지 타입
