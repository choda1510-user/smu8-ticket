export type ListResponse<T> = {
    data: T[]; // 목록 데이터
    page: number; // 현재 페이지 번호
    totalPage: number; // 전체 페이지 수
};

export type PageRequest = {
    currentPage: number; // 프론트가 요청할 현재 페이지 번호
    pageSize: number; // 프론트가 한 페이지에 받고 싶은 데이터 개수
};

export type PageResponse<T> = {
    currentPage: number; // 현재 페이지 번호
    pageSize: number; // 페이지 하나당 데이터 개수
    totalElements: number; // 전체 데이터 개수
    totalPages: number; // 전체 페이지 수
    hasNext: boolean; // 다음 페이지 존재 여부
    hasPrevious: boolean; // 이전 페이지 존재 여부
    contents: T[]; // 목록 데이터
};
