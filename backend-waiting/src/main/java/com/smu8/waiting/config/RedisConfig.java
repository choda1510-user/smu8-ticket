package com.smu8.waiting.config;

import com.smu8.waiting.entity.ConcertReservationTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class RedisConfig {

    @Bean(name = "redisWaitingConnectionFactory")
    public RedisConnectionFactory redisWaitingConnectionFactory(
            @Value("${spring.data.redis-waiting.host:localhost}")
            String host,
            @Value("${spring.data.redis-waiting.port:6381}")
            int port
    ) {
        return new LettuceConnectionFactory(host, port);
    }

    @Bean(name = "concertReservationTimeRedisTemplate")
    public RedisTemplate<String, ConcertReservationTime> concertReservationTimeRedisTemplate(
            @Qualifier("redisWaitingConnectionFactory")
            RedisConnectionFactory redisWaitingConnectionFactory,
            ObjectMapper objectMapper
    ) {
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        RedisTemplate<String, ConcertReservationTime> redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(redisWaitingConnectionFactory);
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        redisTemplate.setValueSerializer(createConcertReservationTimeRedisSerializer(objectMapper));
        redisTemplate.setHashValueSerializer(createConcertReservationTimeRedisSerializer(objectMapper));

        return redisTemplate;
    }

    @Bean(name = "concertWaitingQueueRedisTemplate")
    public RedisTemplate<String, String> concertWaitingQueueRedisTemplate(
            @Qualifier("redisWaitingConnectionFactory")
            RedisConnectionFactory redisWaitingConnectionFactory
    ) {
        return createStringRedisTemplate(redisWaitingConnectionFactory);
    }

    @Bean(name = "concertPassedUserRedisTemplate")
    public RedisTemplate<String, String> concertPassedUserRedisTemplate(
            @Qualifier("redisWaitingConnectionFactory")
            RedisConnectionFactory redisWaitingConnectionFactory
    ) {
        return createStringRedisTemplate(redisWaitingConnectionFactory);
    }

    private RedisTemplate<String, String> createStringRedisTemplate(
            RedisConnectionFactory connectionFactory
    ) {
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();

        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(stringRedisSerializer);
        redisTemplate.setValueSerializer(stringRedisSerializer);
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        redisTemplate.setHashValueSerializer(stringRedisSerializer);

        return redisTemplate;
    }

    private JacksonJsonRedisSerializer<ConcertReservationTime> createConcertReservationTimeRedisSerializer(ObjectMapper objectMapper) {
        return new JacksonJsonRedisSerializer<>(objectMapper, ConcertReservationTime.class);
    }
}
