package com.smu8.ticket.home.dto.result;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.file.service.StorageService;
import lombok.Builder;

@Builder
// Service 결과 DTO는 Entity를 그대로 노출하지 않고 홈 배너에 필요한 값만 담습니다.
public record HomeBannerResult(
        Long concertId,
        String title,
        String imageUrl
) {
    public static HomeBannerResult from(Concert concert, StorageService storageService) {
        // 별도 배너 테이블이 없으므로 현재는 공연 ID를 배너 식별값으로 함께 사용합니다.
        return HomeBannerResult.builder()
                .concertId(concert.getId())
                .title(concert.getTitle())
                .imageUrl(storageService.getUrl(concert.getScreenPosterId()))
                .build();
    }
}
