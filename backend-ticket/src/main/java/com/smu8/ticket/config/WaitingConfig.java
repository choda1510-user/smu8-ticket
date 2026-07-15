package com.smu8.ticket.config;

import com.smu8.ticket.waiting.entity.ConcertReservationTime;
import com.smu8.ticket.waiting.event.ConcertWaitingRegistrationEventListener;
import com.smu8.ticket.waiting.filter.WaitingActiveAccountFilter;
import com.smu8.ticket.waiting.provider.WaitingActiveAccountProvider;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import tools.jackson.databind.ObjectMapper;

@Profile({"local-dev-waiting", "local-test-waiting", "test-waiting", "prod"})
@Configuration
public class WaitingConfig {
    @Bean
    public ConcertWaitingRegistrationEventListener concertWaitingRegistrationEventListener(
            @Qualifier("concertReservationTimeRedisTemplate")
            RedisTemplate<String, ConcertReservationTime> concertReservationTimeRedisTemplate
    ) {
        return new ConcertWaitingRegistrationEventListener(concertReservationTimeRedisTemplate);
    }
    @Bean
    public WaitingActiveAccountFilter waitingActiveAccountFilter(
            AuthenticationManager authenticationManager,
            ObjectMapper objectMapper
    ) {
        return new WaitingActiveAccountFilter(authenticationManager, objectMapper);
    }
    @Bean
    public WaitingActiveAccountProvider waitingActiveAccountProvider(
            @Qualifier("concertPassedUserRedisTemplate")
            RedisTemplate<String, String> concertPassedUserRedisTemplate
    ) {
        return new WaitingActiveAccountProvider(concertPassedUserRedisTemplate);
    }
}
