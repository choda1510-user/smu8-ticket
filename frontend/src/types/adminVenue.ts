import type { PageResponse, PageResult } from "./api";


 //관리자 공연장 상세 조회 요청 타입
export type AdminVenueDetailRequest = {
    id: number; // 상세 조회 URL에 path variable로 보낼 공연장 고유 ID
}
//관리자 공연장 생성 요청 타입
export type AdminVenueCreateRequest = {
    name: string; // 공연장 이름
    description?: string; // 공연장 설명
    capacity?: number; // 공연장 최대 수용 인원
    zoneNo: string; // 우편번호
    roadAddress: string; // 도로명 주소
    jibunAddress?: string; // 지번 주소
    detailAddress?: string; // 상세 주소
    buildingName?: string; // 건물명
};

//관리자 공연장 수정 요청 타입
export type AdminVenueUpdateRequest = {
    name?: string; // 공연장 이름
    description?: string; // 공연장 설명
    capacity?: number; // 공연장 최대 수용 인원
    zoneNo?: string; // 우편번호
    roadAddress?: string; // 도로명 주소
    jibunAddress?: string; // 지번 주소
    detailAddress?: string; // 상세 주소
    buildingName?: string; // 건물명
};

export type AdminVenueRequest = AdminVenueCreateRequest; // 기존 등록 코드 호환용 관리자 공연장 요청 타입

//관리자 공연장 목록/상세 백엔드 응답 타입
export type AdminVenueItemResponse = {
    id: number; // 공연장 고유 ID
    name: string; // 공연장 이름
    description?: string; // 공연장 설명
    capacity?: number; // 공연장 최대 수용 인원
    zoneNo: string; // 우편번호
    roadAddress: string; // 도로명 주소
    jibunAddress: string; // 지번 주소
    detailAddress: string; // 세부 주소
    buildingName: string; // 건물 이름
    createdAt: string; // 생성일시
    updatedAt: string; // 수정일시
};
//관리자 공연장 목록 조회 API의 백엔드 응답 타입
export type AdminVenuePageResponse = PageResponse<AdminVenueItemResponse>;

//관리자 공연장 상세 조회 API의 백엔드 응답 타입
export type AdminVenueDetailResponse = AdminVenueItemResponse;


//관리자 공연장 등록 API 응답 타입
export type AdminVenueCreateResponse = {
    id: number;
};

//관리자 공연장 수정 API 응답 타입
export type AdminVenueUpdateResponse = {
    id: number;
};

// *프론트 페이지 / 컴포넌트에서 렌더링할 때 사용하는 타입

//관리자 공연장 목록의 각 항목 타입
export type AdminVenueItem = {
    id: number; // 공연장 고유 ID
    venueCode: string; // 난수로 생성된 공연장 코드
    venueName: string; // 공연장 이름
    address: string; // 공연장 주소
}
// 관리자 공연장 목록 페이지 타입
export type AdminVenuePageResult = PageResult<AdminVenueItem>;
// 관리자 공연장 상세 페이지 타입
export type AdminVenueDetail = AdminVenueItem;


