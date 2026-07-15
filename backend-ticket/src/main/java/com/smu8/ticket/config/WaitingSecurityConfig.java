package com.smu8.ticket.config;

import com.smu8.ticket.waiting.filter.WaitingActiveAccountFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.filter.CompositeFilter;

import java.util.List;

@Profile({"local-dev-waiting", "local-test-waiting", "test-waiting", "prod"})
@EnableWebSecurity
@Configuration
public class WaitingSecurityConfig {
    @Order(0)
    @Bean
    public SecurityFilterChain waitingReservationFilterChain(
            HttpSecurity http,
            BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter,
            WaitingActiveAccountFilter waitingActiveAccountFilter
    ) throws Exception {
        CompositeFilter waitingReservationAuthenticationFilter = new CompositeFilter();
        waitingReservationAuthenticationFilter.setFilters(List.of(
                bearerTokenAuthenticationFilter,
                waitingActiveAccountFilter
        ));

        return http.securityMatcher("/api/reservations/**", "/api/reservaions/**")
                .authorizeHttpRequests((authorize) -> authorize
                        .anyRequest().authenticated())
                .sessionManagement((session) ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .addFilterBefore(
                        waitingReservationAuthenticationFilter,
                        AuthorizationFilter.class)
                .build();
    }
}
