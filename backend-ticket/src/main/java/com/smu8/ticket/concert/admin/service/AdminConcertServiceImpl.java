package com.smu8.ticket.concert.admin.service;

import com.smu8.ticket.concert.admin.dto.command.*;
import com.smu8.ticket.concert.dto.result.ConcertDetailResult;
import com.smu8.ticket.concert.dto.query.ConcertDetailQuery;
import com.smu8.ticket.concert.dto.query.ConcertPageQuery;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.dto.result.PageResult;
import com.smu8.ticket.file.service.StorageService;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminConcertServiceImpl implements AdminConcertService {
    private final ConcertRepository concertRepository;
    private final StorageService storageService;
    private final VenueRepository venueRepository;

    @Override
    public ConcertDetailResult createConcert(CreateConcertCommand command) {
        validateCreateConcert(command);

        Venue venue = getVenueById(command.venueId());
        String cardPosterKey = storageService.store(command.cardPoster());
        String bannerPosterKey = storageService.store(command.bannerPoster());
        String descriptionPosterKey = storageService.store(command.descriptionPoster());
        Concert concert = command.toEntity(
                venue,
                storageService.getUrl(cardPosterKey),
                storageService.getUrl(bannerPosterKey),
                storageService.getUrl(descriptionPosterKey)
        );
        return ConcertDetailResult.from(concertRepository.save(concert));
    }


    @Override
    @Transactional(readOnly = true)
    public PageResult<ConcertDetailResult> getConcerts(ConcertPageQuery query) {
//        return concertRepository.findAll().stream()
//                .map(ConcertDetailResult::from)
//                .toList();
        return PageResult.from(concertRepository.findAll(PageRequest.of(query.pageQuery().page(), query.pageQuery().size()))
                .map(ConcertDetailResult::from));
    }

    @Override
    @Transactional(readOnly = true)
    public ConcertDetailResult getConcert(ConcertDetailQuery query) {
        return ConcertDetailResult.from(getById(query.id()));
    }


    @Override
    @Transactional
    public ConcertDetailResult updateConcert(UpdateConcertCommand command) {
        Concert concert = getById(command.id());
        Venue venue = getVenueById(command.venueId());
        command.update(concert, venue);
        return ConcertDetailResult.from(concert);
    }

    @Override
    public void deleteConcert(Long id) {
        concertRepository.delete(getById(id));
    }

    private Concert getById(Long id) {
        return concertRepository.findById(id).orElseThrow();
    }

    private Venue getVenueById(Long venueId) {
        return venueRepository.findById(venueId).orElseThrow();
    }

    private void validateCreateConcert(CreateConcertCommand command){
        if (command.title()==null || command.title().isBlank()){
            throw new IllegalArgumentException("공연 제목은 필수입니다.");
        }
        if (command.venueId()==null){
            throw new IllegalArgumentException("공연장을 선택해야합니다.");
        }
        if (command.startReservationAt()==null){
            throw new IllegalArgumentException("예매 시작일시는 필수입니다.");
        }
        if (command.schedules()==null||command.schedules().isEmpty()){
            throw new IllegalArgumentException("공연 회차는 하나 이상이어야 합니다.");
        }
        if (command.seatGrades()==null||command.seatGrades().isEmpty()){
            throw new IllegalArgumentException("좌석 등급은 하나 이상이어야 합니다.");
        }
        if (command.cardPoster()==null || command.cardPoster().isEmpty()){
            throw new IllegalArgumentException("카드 포스터는 필수입니다.");
        }
        if (command.bannerPoster() == null || command.bannerPoster().isEmpty()){
            throw new IllegalArgumentException("배너 포스터는 필수입니다.");
        }
        if (command.descriptionPoster() == null || command.descriptionPoster().isEmpty()){
            throw new IllegalArgumentException("상세 포스터는 필수입니다.");
        }
        for (CreatePerformanceScheduleCommand schedule : command.schedules()){
            if (schedule.date()==null){
                throw new IllegalArgumentException("공연 시작일시는 필수입니다.");
            }
            if (schedule.reservationEndAt()==null){
                throw new IllegalArgumentException("예매 종료일시는 필수입니다.");
            }
            if (!command.startReservationAt()
                    .isBefore(schedule.reservationEndAt())) {
                throw new IllegalArgumentException("예매 시작일시는 예매 종료일시보다 이전이어야 합니다.");
            }
            if (!schedule.reservationEndAt().isBefore(schedule.date())){
                throw new IllegalArgumentException("예매 종료일시는 공연 시작일시보다 이전이어야 합니다.");
            }
            if (schedule.rowMax()== null|| schedule.rowMax() <= 0 || schedule.rowMax()>1000){
                throw new IllegalArgumentException("좌석 행 개수는 1개 이상 1000개 이하여야합니다.");
                }
            if (schedule.colMax()==null|| schedule.colMax() <=0 || schedule.colMax()>1000){
                throw new IllegalArgumentException("좌석의 열개수는 1개 이상 1000개 이하여야합니다.");
            }
            }
        for (CreateSeatGradeCommand grade : command.seatGrades()){
            if (grade.gradeName() ==null || grade.gradeName().isBlank()){
                throw new IllegalArgumentException("좌석 등급 이름은 필수입니다.");
            }
            if (grade.price() == null || grade.price()<0){
                throw new IllegalArgumentException("좌석 가격은 0원 이상이어야합니다");
            }
        }

    }
}
