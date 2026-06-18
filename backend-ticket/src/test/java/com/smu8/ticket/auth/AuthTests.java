package com.smu8.ticket.auth;

import com.smu8.ticket.account.entity.Account;
import com.smu8.ticket.account.repository.AccountRepository;
import com.smu8.ticket.auth.filter.RefreshTokenCookieAuthenticationFilter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.ObjectMapper;

import java.util.Base64;
import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
        accountRepository.save(Account.builder()
                .id(UUID.randomUUID().toString())
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(nickname)
                .build());

        ResultActions result = mockMvc.perform(get("/api/token")
                .with(httpBasic(username, password)));

        System.out.println(result.andReturn().getResponse().getContentAsString());
        result.andExpect(status().isOk())
                .andExpect(cookie().exists(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME))
                .andExpect(cookie().httpOnly(RefreshTokenCookieAuthenticationFilter.REFRESH_TOKEN_COOKIE_NAME, true));
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

        System.out.println(result.andReturn().getResponse().getContentAsString());
        result.andExpect(status().isUnauthorized());
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
