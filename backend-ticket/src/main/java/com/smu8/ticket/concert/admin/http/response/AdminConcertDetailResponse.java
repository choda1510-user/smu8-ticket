package com.smu8.ticket.concert.admin.http.response;

import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.http.response.SeatGradeResponse;
import com.smu8.ticket.concert.http.response.SeatResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Builder
public record AdminConcertDetailResponse(
        @Schema(description = "공연 고유 ID", example = "1")
        Long id,
        @Schema(description = "공연 코드")
        String concertCode,
        @Schema(description = "공연 제목", example = "SM 콘서트 2026")
        String title,
        @Schema(description = "공연 설명", example = "대표 아티스트들이 함께하는 라이브 콘서트입니다.")
        String description,
        @Schema(description = "공연 카드 포스터 이미지 주소")
        String cardPosterUrl,
        @Schema(description = "공연 배너 포스터 이미지 주소")
        String bannerPosterUrl,
        @Schema(description = "공연 설명 포스터 이미지 주소")
        String descriptionPosterUrl,
        @Schema(description = "공연 러닝타임", example = "90분")
        String runningTime,
        @Schema(description = "공연 회차 목록")
        List<AdminConcertScheduleResponse> schedules,
        @Schema(description = "좌석 등급 목록")
        List<SeatGradeResponse> seatGrades,
        @Schema(description = "좌석 목록")
        List<SeatResponse> seats,
        @Schema(description = "예매 시작일시")
        LocalDateTime reservationStartAt,
        @Schema(description = "예매 상태")
        String reservationStatus,
        @Schema(description = "공연장 고유 ID", example = "1")
        Long venueId,
        @Schema(description = "공연장 이름", example = "서울아트센터")
        String venueName,
        @Schema(description = "공지사항")
        String notice,
        @Schema(description = "좌석 행 개수")
        Integer rowMax,
        @Schema(description = "좌석 열 개수")
        Integer colMax,
        @Schema(description = "생성일시", example = "2026-06-22T10:30:00")
        LocalDateTime createdAt,
        @Schema(description = "수정일시", example = "2026-06-22T10:30:00")
        LocalDateTime updatedAt
) {
    public static AdminConcertDetailResponse from(ConcertDetailResult result) {
        LocalDateTime reservationStartAt = Optional.ofNullable(result.schedules())
                .orElseGet(List::of)
                .stream()
                .findFirst()
                .map(schedule -> schedule.reservationStartAt())
                .orElse(null);
        List<AdminConcertScheduleResponse> schedules = Optional.ofNullable(result.schedules())
                .orElseGet(List::of)
                .stream()
                .map(schedule -> AdminConcertScheduleResponse.builder()
                        .id(schedule.id())
                        .concertId(result.id())
                        .date(schedule.showStartAt())
                        .reservationEndAt(schedule.reservationEndAt())
                        .build())
                .toList();
        List<SeatGradeResponse> seatGrades = Optional.ofNullable(result.seatGrades())
                .orElseGet(List::of)
                .stream()
                .map(grade -> SeatGradeResponse.builder()
                        .id(grade.id())
                        .gradeName(grade.gradeName())
                        .price(grade.price())
                        .color(grade.color())
                        .build())
                .toList();
        List<SeatResponse> seats = Optional.ofNullable(result.seats())
                .orElseGet(List::of)
                .stream()
                .map(SeatResponse::from)
                .toList();

        return AdminConcertDetailResponse.builder()
                .id(result.id())
                .concertCode(result.performanceCode())
                .title(result.title())
                .description(result.description())
                .cardPosterUrl(result.cardPosterUrl())
                .bannerPosterUrl(result.screenPosterUrl())
                .descriptionPosterUrl(result.descriptionPosterUrl())
                .runningTime(result.runningTime())
                .schedules(schedules)
                .seatGrades(seatGrades)
                .seats(seats)
                .reservationStartAt(reservationStartAt)
                .reservationStatus(result.performanceStatus())
                .venueId(result.venueId())
                .venueName(result.venueName())
                .notice(result.notice())
                .createdAt(result.createdAt())
                .updatedAt(result.updatedAt())
                .build();
    }
}
