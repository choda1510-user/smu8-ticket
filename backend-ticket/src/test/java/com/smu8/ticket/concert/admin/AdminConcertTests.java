package com.smu8.ticket.concert.admin;

import com.smu8.ticket.authentication.Authority;
import com.smu8.ticket.concert.entity.Concert;
import com.smu8.ticket.concert.repository.ConcertRepository;
import com.smu8.ticket.venue.entity.Address;
import com.smu8.ticket.venue.entity.Venue;
import com.smu8.ticket.venue.repository.VenueRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminConcertTests {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private VenueRepository venueRepository;
    @Autowired
    private ConcertRepository concertRepository;

    @AfterEach
    public void afterEach() {
        concertRepository.deleteAll();
        venueRepository.deleteAll();
    }

    @Test
    @DisplayName("관리자는 공연을 등록, 조회, 수정, 삭제할 수 있다")
    public void adminConcertCrud() throws Exception {
        Venue venue = createVenue("예술의전당");

        mockMvc.perform(post("/api/admin/concerts")
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "에스파 콘서트",
                                  "description": "테스트 공연",
                                  "startAt": "2026-07-10T19:00:00",
                                  "endAt": "2026-07-10T21:00:00",
                                  "venueId": %d
                                }
                                """.formatted(venue.getId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("에스파 콘서트"))
                .andExpect(jsonPath("$.venueId").value(venue.getId()))
                .andExpect(jsonPath("$.venueName").value("예술의전당"));

        Concert concert = concertRepository.findAll().get(0);

        mockMvc.perform(get("/api/admin/concerts")
                        .with(adminJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.concerts[0].id").value(concert.getId()))
                .andExpect(jsonPath("$.concerts[0].title").value("에스파 콘서트"));

        mockMvc.perform(get("/api/admin/concerts/" + concert.getId())
                        .with(adminJwt()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(concert.getId()))
                .andExpect(jsonPath("$.title").value("에스파 콘서트"));

        mockMvc.perform(patch("/api/admin/concerts/" + concert.getId())
                        .with(adminJwt())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "에스파 콘서트 수정",
                                  "description": "수정된 테스트 공연",
                                  "startAt": "2026-07-11T19:00:00",
                                  "endAt": "2026-07-11T21:00:00",
                                  "venueId": %d
                                }
                                """.formatted(venue.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(concert.getId()))
                .andExpect(jsonPath("$.title").value("에스파 콘서트 수정"))
                .andExpect(jsonPath("$.description").value("수정된 테스트 공연"));

        mockMvc.perform(delete("/api/admin/concerts/" + concert.getId())
                        .with(adminJwt()))
                .andExpect(status().isNoContent());

        Assertions.assertFalse(concertRepository.existsById(concert.getId()));
    }

    @Test
    @DisplayName("일반 사용자는 관리자 공연 API를 사용할 수 없다")
    public void userCannotCreateConcert() throws Exception {
        Venue venue = createVenue("예술의전당");

        ResultActions result = mockMvc.perform(post("/api/admin/concerts")
                .with(userJwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "title": "에스파 콘서트",
                          "description": "테스트 공연",
                          "startAt": "2026-07-10T19:00:00",
                          "endAt": "2026-07-10T21:00:00",
                          "venueId": %d
                        }
                        """.formatted(venue.getId())));

        result.andExpect(status().isForbidden());
    }

    private Venue createVenue(String name) {
        Address address = Address.builder()
                .zoneNo("06757")
                .roadAddress("서울 서초구 남부순환로 2406")
                .jibunAddress("서울 서초구 서초동 700")
                .detailAddress("오페라하우스")
                .buildingName(name)
                .build();
        Venue venue = Venue.builder()
                .name(name)
                .address(address)
                .build();
        return venueRepository.save(venue);
    }

    private static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor adminJwt() {
        return jwt().authorities(new SimpleGrantedAuthority(Authority.ADMIN.toString()));
    }

    private static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor userJwt() {
        return jwt().authorities(new SimpleGrantedAuthority(Authority.ACCESS_TOKEN.toString()));
    }
}
