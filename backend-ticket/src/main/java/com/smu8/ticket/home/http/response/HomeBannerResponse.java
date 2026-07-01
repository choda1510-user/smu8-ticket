package com.smu8.ticket.home.http.response;

import com.smu8.ticket.home.dto.result.HomeBannerResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
// 프론트와 맞춘 응답 형태를 따로 두어 내부 Result 변경이 API 계약에 바로 번지지 않게 합니다.
public record HomeBannerResponse(
        @Schema(description = "공연 고유 ID")
        Long concertId,
        @Schema(description = "공연 제목")
        String title,
        @Schema(description = "홈 배너 이미지 주소")
        String imageUrl
) {
    public static HomeBannerResponse from(HomeBannerResult result) {
        // Result를 Response로 변환해 외부로 내려줄 필드만 명확히 고정합니다.
        return HomeBannerResponse.builder()
                .concertId(result.concertId())
                .title(result.title())
                .imageUrl(result.imageUrl())
                .build();
    }
}
