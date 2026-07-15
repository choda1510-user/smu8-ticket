package com.smu8.ticket.config;

import com.smu8.ticket.waiting.entity.ConcertReservationTime;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.ObjectMapper;

@Profile({"local-dev-waiting", "local-test-waiting", "test-waiting", "prod"})
@Configuration
public class WaitingRedisConfig {

    @Bean(name = "redisWaitingConnectionFactory")
    public RedisConnectionFactory redisWaitingConnectionFactory(
            @Value("${spring.data.redis-waiting.host}") String host,
            @Value("${spring.data.redis-waiting.port}") int port
    ) {
        return new LettuceConnectionFactory(host, port);
    }

    @Bean(name = "concertReservationTimeRedisTemplate")
    public RedisTemplate<String, ConcertReservationTime> concertReservationTimeRedisTemplate(
            @Qualifier("redisWaitingConnectionFactory") RedisConnectionFactory redisWaitingConnectionFactory,
            ObjectMapper objectMapper
    ) {
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        JacksonJsonRedisSerializer<ConcertReservationTime> valueSerializer =
                new JacksonJsonRedisSerializer<>(objectMapper, ConcertReservationTime.class);

        RedisTemplate<String, ConcertReservationTime> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisWaitingConnectionFactory);
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        redisTemplate.setValueSerializer(valueSerializer);
        redisTemplate.setHashValueSerializer(valueSerializer);
        return redisTemplate;
    }

    @Bean(name = "concertPassedUserRedisTemplate")
    public RedisTemplate<String, String> concertPassedUserRedisTemplate(
            @Qualifier("redisWaitingConnectionFactory") RedisConnectionFactory redisWaitingConnectionFactory
    ) {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisWaitingConnectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}
