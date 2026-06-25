package com.smu8.ticket.venue.http.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record CreateVenueRequest(
        @Schema(description = "공연장 이름", example = "서울아트센터")
        String name,
        @Schema(description = "공연장 설명", example = "설명")
        String description,
        @Schema(description = "공연장 최대 수용 인원", example = "1000")
        Integer capacity,
        @Schema(description = "우편번호", example = "06234")
        String zoneNo,
        @Schema(description = "도로명 주소", example = "서울특별시 강남구 테헤란로 123")
        String roadAddress,
        @Schema(description = "지번 주소", example = "서울특별시 강남구 역삼동 123-45")
        String jibunAddress,
        @Schema(description = "상세 주소", example = "3층 대공연장")
        String detailAddress,
        @Schema(description = "건물명", example = "서울아트센터")
        String buildingName
) {
}
