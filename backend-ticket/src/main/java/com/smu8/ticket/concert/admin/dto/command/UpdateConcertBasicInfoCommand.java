package com.smu8.ticket.concert.admin.dto.command;

import com.smu8.ticket.concert.admin.http.request.UpdateConcertBasicInfoRequest;
import com.smu8.ticket.concert.entity.Concert;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

@Builder
public record UpdateConcertBasicInfoCommand(
        Long id,
        String title,
        String description,
        String runningTime,
        MultipartFile cardPoster,
        MultipartFile bannerPoster,
        MultipartFile descriptionPoster
) {
    public static UpdateConcertBasicInfoCommand from(
            Long id,
            UpdateConcertBasicInfoRequest request,
            MultipartFile cardPoster,
            MultipartFile bannerPoster,
            MultipartFile descriptionPoster
    ) {
        return UpdateConcertBasicInfoCommand.builder()
                .id(id)
                .title(request.title())
                .description(request.description())
                .runningTime(request.runningTime())
                .cardPoster(cardPoster)
                .bannerPoster(bannerPoster)
                .descriptionPoster(descriptionPoster)
                .build();
    }

    public void update(Concert concert) {
        if (title != null) {
            concert.setTitle(title);
        }
        if (description != null) {
            concert.setDescription(description);
        }
        if (runningTime != null) {
            concert.setRunningTime(runningTime);
        }
    }

    public boolean hasNewCardPoster() {
        return cardPoster != null && !cardPoster.isEmpty();
    }

    public boolean hasNewBannerPoster() {
        return bannerPoster != null && !bannerPoster.isEmpty();
    }

    public boolean hasNewDescriptionPoster() {
        return descriptionPoster != null && !descriptionPoster.isEmpty();
    }
}