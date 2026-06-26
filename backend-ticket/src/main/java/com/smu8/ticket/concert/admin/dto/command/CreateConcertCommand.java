package com.smu8.ticket.concert.admin.dto.command;

import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.admin.http.request.CreateConcertRequest;
import com.smu8.ticket.concert.entity.PerformanceSchedule;
import com.smu8.ticket.concert.entity.Seat;
import com.smu8.ticket.concert.entity.SeatGrade;
import com.smu8.ticket.venue.entity.Venue;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

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
        List<CreateSeatGradeCommand> seatGrades = request.seatGrades() == null
                ? List.of()
                : request.seatGrades().stream()
                .map(CreateSeatGradeCommand::from)
                .toList();

        List<CreatePerformanceScheduleCommand> schedules = request.schedules() == null
                ? List.of()
                : request.schedules().stream()
                .map(schedule -> CreatePerformanceScheduleCommand.from(
                        schedule,
                        request.seats(),
                        request.rowMax(),
                        request.colMax()
                ))
                .toList();

        return CreateConcertCommand.builder()
                .title(request.title())
                .description(request.description())
                .startReservationAt(request.reservationStartAt())
                .venueId(request.venueId())
                .seatGrades(seatGrades)
                .schedules(schedules)
                .cardPoster(cardPoster)
                .bannerPoster(bannerPoster)
                .descriptionPoster(descriptionPoster)
                .build();
    }

    public Concert toEntity(Venue venue) {
        Concert concert = Concert.builder()
                .performanceCode(createPerformanceCode())
                .title(title)
                .performanceStatus("READY")
                .description(description)
                .venue(venue)
                .cardPosterUrl(getOriginalFilename(cardPoster))
                .screenPosterUrl(getOriginalFilename(bannerPoster))
                .descriptionPosterUrl(getOriginalFilename(descriptionPoster))
                .build();

        List<SeatGrade> seatGradeEntities = seatGrades.stream()
                .map(seatGrade -> SeatGrade.builder()
                        .concert(concert)
                        .gradeName(seatGrade.gradeName())
                        .price(seatGrade.price())
                        .color(seatGrade.color())
                        .build())
                .toList();

        Map<String, SeatGrade> seatGradeMap = seatGradeEntities.stream()
                .collect(Collectors.toMap(SeatGrade::getGradeName, Function.identity()));

        List<PerformanceSchedule> scheduleEntities = schedules.stream()
                .map(schedule -> {
                    PerformanceSchedule performanceSchedule = PerformanceSchedule.builder()
                            .concert(concert)
                            .showStartAt(schedule.date())
                            .reservationStartAt(startReservationAt)
                            .reservationEndAt(schedule.reservationEndAt())
                            .seatRowCount(schedule.rowMax())
                            .seatColumnCount(schedule.colMax())
                            .build();

                    List<Seat> seatEntities = schedule.seats().stream()
                            .map(seat -> Seat.builder()
                                    .performanceSchedule(performanceSchedule)
                                    .seatGrade(findSeatGrade(seatGradeMap, seat.seatGradeName()))
                                    .rowIndex(seat.row())
                                    .columnIndex(seat.col())
                                    .build())
                            .toList();

                    performanceSchedule.setSeats(seatEntities);
                    return performanceSchedule;
                })
                .toList();

        concert.setSeatGrades(seatGradeEntities);
        concert.setPerformanceSchedules(scheduleEntities);

        return concert;
    }

    private static String createPerformanceCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }

    private static String getOriginalFilename(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        return "http://192.168.0.6";
    }

    private static SeatGrade findSeatGrade(Map<String, SeatGrade> seatGradeMap, String seatGradeName) {
        SeatGrade seatGrade = seatGradeMap.get(seatGradeName);
        if (seatGrade == null) {
            throw new IllegalArgumentException("존재하지 않는 좌석 등급입니다: " + seatGradeName);
        }
        return seatGrade;
    }
}
