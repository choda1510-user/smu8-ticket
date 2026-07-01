package com.smu8.ticket.home.service;

import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.file.service.StorageService;
import com.smu8.ticket.home.dto.result.HomeBannerResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeBannerServiceImpl implements HomeBannerService {
    // 홈 첫 화면에서 보여줄 배너 개수를 한 곳에서 관리하기 위한 값입니다.
    private static final int HOME_BANNER_SIZE = 4;

    private final ConcertRepository concertRepository;
    // 공연 이미지 ID를 실제 접근 가능한 이미지 URL로 변환하기 위해 사용합니다.
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public List<HomeBannerResult> getHomeBanners() {
        // 현재는 기존 화면과 동일하게 공연 4개를 사용하고, 이후 추천 로직은 이 조회 부분만 교체하면 됩니다.
        return concertRepository.findAll(PageRequest.of(0, HOME_BANNER_SIZE)).stream()
                .map(concert -> HomeBannerResult.from(concert, storageService))
                .toList();
    }
}
