package com.smu8.ticket.config;

import com.smu8.ticket.utils.JwtGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtEncoder;

@Configuration
public class UtilsConfig {
    @Bean
    public JwtGenerator jwtGenerator(JwtEncoder jwtEncoder) {
        return new JwtGenerator(jwtEncoder);
    }
}
