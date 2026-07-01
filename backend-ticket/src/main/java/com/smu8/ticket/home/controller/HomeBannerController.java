package com.smu8.ticket.home.controller;

import com.smu8.ticket.home.http.response.HomeBannerResponse;
import com.smu8.ticket.home.service.HomeBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HomeBannerController {
    private final HomeBannerService homeBannerService;

    // 홈 배너만 담당하는 API를 따로 두어 이후 추천/개인화 로직이 공연 목록 API에 섞이지 않게 합니다.
    @GetMapping("/api/home/banners")
    public ResponseEntity<List<HomeBannerResponse>> getHomeBanners() {
        return ResponseEntity.ok(
                // Service 결과를 프론트 응답 DTO로 변환해 Controller가 API 응답 형태만 책임지게 합니다.
                homeBannerService.getHomeBanners().stream()
                        .map(HomeBannerResponse::from)
                        .toList()
        );
    }
}
