package com.smu8.ticket.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

@Configuration
public class RedisConfig {
    @Value("${spring.data.redis-ticket.host}")
    private String host;

    @Value("${spring.data.redis-ticket.port}")
    private int port;
    @Bean
    public RedisConnectionFactory redisTicketConnectionFactory() {
        return new LettuceConnectionFactory(host, port);
    }
    @Bean
    public RedisTemplate<?, ?> redisTicketTemplate() {
        RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisTicketConnectionFactory());
        return redisTemplate;
    }
    @Profile("dev")
    @Bean
    public RedisConnectionFactory redisFileConnectionFactory(
            @Value("${spring.data.redis-file.host}")
            String host,
            @Value("${spring.data.redis-file.port}")
            int port
    ) {
        return new LettuceConnectionFactory(host, port);
    }
    @Profile("dev")
    @Bean
    public RedisTemplate<?, ?> redisFileTemplate(RedisConnectionFactory redisFileConnectionFactory) {
        RedisTemplate<?, ?> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisFileConnectionFactory);
        return redisTemplate;
    }
}

