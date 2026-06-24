import type {PageRequest, PageResponse} from "@/types/api";
import type {ConcertResponse} from "@/types/concert";

export type AdminVenueListRequest = PageRequest & {
    venue_code?: string; // 관리자 공연장 목록에서 공연장 코드로 검색할 때 URL 쿼리 파라미터로 보낼 값
    venue_name?: string; // 관리자 공연장 목록에서 공연장명으로 검색할 때 URL 쿼리 파라미터로 보낼 값
};

export type AdminVenueDetailRequest = {
    id: number; // 상세 조회 URL에 path variable로 보낼 공연장 고유 ID
};

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

export type AdminVenueResponse = {
    id: number; // 공연장 고유 ID
    venue_code: string; // 난수로 생성된 공연장 코드
    venue_name: string; // 공연장 이름
    address: string; // 공연장 주소
    current_concerts?: ConcertResponse[]; // 현재 해당 공연장에 등록되어 있는 공연 목록
};

export type AdminVenueListResponse = PageResponse<AdminVenueResponse>; // 관리자 공연장 목록 조회 API의 페이지 응답 타입
