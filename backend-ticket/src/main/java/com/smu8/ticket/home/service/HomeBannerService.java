package com.smu8.ticket.home.service;

import com.smu8.ticket.home.dto.result.HomeBannerResult;
import java.util.List;

public interface HomeBannerService {
    // Controller가 배너 선정 방식에 의존하지 않도록 홈 배너 조회 계약만 노출합니다.
    List<HomeBannerResult> getHomeBanners();
}
