package com.smu8.ticket.config;

import com.smu8.ticket.utils.JwtGenerator;
import com.smu8.ticket.utils.RefreshTokenUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;

@Configuration
public class UtilsConfig {
    @Bean
    public JwtGenerator jwtGenerator(JwtEncoder jwtEncoder) {
        return new JwtGenerator(jwtEncoder, "http://localhost:8080");
    }
    @Bean
    public RefreshTokenUtils refreshTokenCookieUtils(JwtDecoder jwtDecoder) {
        return new RefreshTokenUtils(false, 7 * 24 * 60 * 60, jwtDecoder);
    }
}
