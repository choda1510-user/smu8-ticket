package com.smu8.ticket.concert.admin.dto.command;

import com.smu8.ticket.concert.admin.http.request.UpdateConcertBasicInfoRequest;
import com.smu8.ticket.concert.entity.Concert;
import lombok.Builder;

@Builder
public record UpdateConcertBasicInfoCommand(
        Long id,
        String title,
        String description,
        String runningTime
) {
    public static UpdateConcertBasicInfoCommand from(Long id, UpdateConcertBasicInfoRequest request) {
        return UpdateConcertBasicInfoCommand.builder()
                .id(id)
                .title(request.title())
                .description(request.description())
                .runningTime(request.runningTime())
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
}