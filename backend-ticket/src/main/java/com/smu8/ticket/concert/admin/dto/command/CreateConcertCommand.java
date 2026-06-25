package com.smu8.ticket.concert.admin.dto.command;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.admin.http.request.CreateConcertRequest;
import com.smu8.ticket.venue.entity.Venue;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record CreateConcertCommand(
        String title,
        String description,
        LocalDateTime startReservationAt,
        Long venueId,
        List<CreateSeatGradeCommand> seatGrades,
        List<CreatePerformanceScheduleCommand> schedules,
        MultipartFile cardPoster,
        MultipartFile bannerPoster,
        MultipartFile descriptionPoster
) {
    public static CreateConcertCommand from(CreateConcertRequest request, MultipartFile cardPoster, MultipartFile bannerPoster, MultipartFile descriptionPoster) {
        return null;
    }

    public Concert toEntity(Venue venue) {
        return null;
    }
}
