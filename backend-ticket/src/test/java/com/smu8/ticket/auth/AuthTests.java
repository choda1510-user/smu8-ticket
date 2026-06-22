package com.smu8.ticket.auth;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.account.repository.AccountRepository;
import com.smu8.ticket.auth.filter.RefreshTokenCookieAuthenticationFilter;
import com.smu8.ticket.authentication.Authority;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthTests {
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private FilterChainProxy springSecurityFilterChain;
    @Autowired
    private JwtDecoder jwtDecoder;
    @AfterEach
    public void afterEach() {
        accountRepository.deleteAll();
    }
    @Test
    @DisplayName("로그인")
    public void login() throws Exception {
        String username = "username";
        String password = "password";
        String nickname = "nickname";
        String id = UUID.randomUUID().toString();
        accountRepository.save(Account.builder()
                .id(id)
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(nickname)
                .build());

        ResultActions result = mockMvc.perform(get("/api/token")
                .with(httpBasic(username, password)));

        result.andExpect(status().isOk())
                .andExpect(cookie().exists(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME))
                .andExpect(cookie().httpOnly(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME, true));
        Jwt ajwt = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Jwt.class);
        Jwt rjwt = jwtDecoder.decode(result.andReturn().getResponse().getCookie(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME).getValue());
        Assertions.assertEquals(ajwt.getSubject(), id);
        Assertions.assertEquals(rjwt.getSubject(), id);
    }
    @Test
    @DisplayName("로그인 실패")
    public void loginFailed() throws Exception {
        String username = "username";
        String password = "password";
        String nickname = "nickname";
        accountRepository.save(Account.builder()
                .id(UUID.randomUUID().toString())
                .username(username)
                .password(password)
                .nickname(nickname)
                .build());

        ResultActions result = mockMvc.perform(get("/api/token")
                .with(httpBasic(nickname, password)));

        result.andExpect(status().isUnauthorized());
    }
    @Test
    @DisplayName("토큰 재발급")
    public void refresh() throws Exception {
        String username = "username";
        String password = "password";
        String nickname = "nickname";
        String id = UUID.randomUUID().toString();
        accountRepository.save(Account.builder()
                .id(id)
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(nickname)
                .build());
        ResultActions tokenResult = mockMvc.perform(get("/api/token")
                .with(httpBasic(username, password)));
        Cookie refreshCookie = tokenResult.andReturn().getResponse().getCookie(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME);

        ResultActions result = mockMvc.perform(get("/api/refresh")
                .cookie(refreshCookie));

        result.andExpect(status().isOk());
        Jwt ajwt = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Jwt.class);
        Assertions.assertEquals(ajwt.getSubject(), id);
    }
    @Test
    @DisplayName("토큰 재발급 실패")
    public void refreshFailed() throws Exception {
        String username = "username";
        String password = "password";
        String nickname = "nickname";
        String id = UUID.randomUUID().toString();
        accountRepository.save(Account.builder()
                .id(id)
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(nickname)
                .build());

        ResultActions result = mockMvc.perform(get("/api/refresh"));

        result.andExpect(status().isUnauthorized());
    }
    @Test
    @DisplayName("관리자 계정 로그인")
    public void adminLogin() throws Exception {
        String username = "admin";
        String password = "password";
        String nickname = "nickname";
        String id = UUID.randomUUID().toString();
        accountRepository.save(Account.builder()
                .id(id)
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(nickname)
                .build());

        mockMvc.perform(post("/api/account/admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "admin"
                                }
                                """))
                .andExpect(status().isOk());

        ResultActions result = mockMvc.perform(get("/api/token")
                .with(httpBasic(username, password)));

        result.andExpect(status().isOk());
        Jwt ajwt = objectMapper.readValue(result.andReturn().getResponse().getContentAsString(), Jwt.class);
        Assertions.assertEquals(ajwt.getSubject(), id);
        Assertions.assertTrue(ajwt.getClaimAsStringList("authorities").contains(Authority.ADMIN.toString()));
    }
    @Test
    public void printFilters() {
        springSecurityFilterChain.getFilterChains().forEach(chain -> {
            System.out.println("chain = " + chain);
            chain.getFilters().forEach(filter ->
                    System.out.println("  filter = " + filter.getClass().getName())
            );
        });
    }
}
