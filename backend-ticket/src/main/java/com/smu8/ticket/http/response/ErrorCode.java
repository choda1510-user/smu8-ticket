package com.smu8.ticket.http.response;

public enum ErrorCode {
    DUPLICATE_USERNAME,
    DUPLICATE_NICKNAME,
    INVALID_ACCOUNT,
    INVALID_CONCERT,
    // 동일 공연 회차의 2좌석 제한 초과를 프론트가 구분해서 안내할 수 있게 별도 코드로 둡니다.
    RESERVATION_SEAT_LIMIT_EXCEEDED
}
