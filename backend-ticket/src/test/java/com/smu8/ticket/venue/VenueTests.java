package com.smu8.ticket.venue;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.account.repository.AccountRepository;
import com.smu8.ticket.venue.repository.VenueRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class VenueTests {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private VenueRepository venueRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @AfterEach
    public void afterEach() {
        venueRepository.deleteAll();
        accountRepository.deleteAll();
    }

    @Test
    @DisplayName("관리자는 공연장 주소를 저장할 수 있다")
    public void createVenueByAdmin() throws Exception {
        String accessToken = createAccessToken("admin", "password", true);

        ResultActions result = mockMvc.perform(post("/api/admin/venues")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "예술의전당",
                          "zoneNo": "06757",
                          "roadAddress": "서울 서초구 남부순환로 2406",
                          "jibunAddress": "서울 서초구 서초동 700",
                          "detailAddress": "오페라하우스",
                          "buildingName": "예술의전당"
                        }
                        """));

        result.andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("예술의전당"))
                .andExpect(jsonPath("$.zoneNo").value("06757"))
                .andExpect(jsonPath("$.roadAddress").value("서울 서초구 남부순환로 2406"))
                .andExpect(jsonPath("$.detailAddress").value("오페라하우스"))
                .andExpect(jsonPath("$.buildingName").value("예술의전당"));
    }

    @Test
    @DisplayName("일반 사용자는 공연장 주소를 저장할 수 없다")
    public void createVenueByUserFailed() throws Exception {
        String accessToken = createAccessToken("user", "password", false);

        ResultActions result = mockMvc.perform(post("/api/admin/venues")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "예술의전당",
                          "zoneNo": "06757",
                          "roadAddress": "서울 서초구 남부순환로 2406",
                          "jibunAddress": "서울 서초구 서초동 700",
                          "detailAddress": "오페라하우스",
                          "buildingName": "예술의전당"
                        }
                        """));

        result.andExpect(status().isForbidden());
    }

    private String createAccessToken(String username, String password, boolean admin) throws Exception {
        accountRepository.save(Account.builder()
                .id(UUID.randomUUID().toString())
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(username + "-nickname")
                .admin(admin)
                .build());

        ResultActions result = mockMvc.perform(get("/api/token")
                .with(httpBasic(username, password)));
        Jwt jwt = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Jwt.class);
        return jwt.getTokenValue();
    }
}
