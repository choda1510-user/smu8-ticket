package com.smu8.waiting.config;

import com.smu8.waiting.authentication.WaitingJwtAuthenticationConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.util.StreamUtils;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;

@EnableWebSecurity
@Configuration
public class SecurityConfig {
    @Bean
    public SecretKey jwtSecretKey(
            @Value("${token:secret}") String secret,
            @Value("${token:algorithm}") String algorithm
    ) {
        String base64Secret = secret.trim();

        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);

        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT HS256 secret key must be at least 32 bytes.");
        }

        return new SecretKeySpec(keyBytes, algorithm);
    }
    @Order(-1)
    @Bean
    public SecurityFilterChain actuatorFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/actuator/**")
                .authorizeHttpRequests(authorize ->
                        authorize.anyRequest().permitAll())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .build();
    }
    @Order(1)
    @Bean
    public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http, BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter) {
        return http
                .securityMatcher("/api/admin/**")
                .authorizeHttpRequests(authorize ->
                        authorize
                                .anyRequest().hasAuthority("ADMIN"))
                .sessionManagement((session) ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .addFilterBefore(
                        bearerTokenAuthenticationFilter,
                        AuthorizationFilter.class)
                .build();
    }
    @Order(2)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter) {
        return http
                .authorizeHttpRequests(authorize ->
                        authorize
                                .anyRequest().authenticated())
                .sessionManagement((session) ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .addFilterBefore(
                        bearerTokenAuthenticationFilter,
                        AuthorizationFilter.class)
                .build();
    }
    @Bean
    public BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter(AuthenticationManager authenticationManager) {
        return new BearerTokenAuthenticationFilter(authenticationManager);
    }
    @Bean
    public AuthenticationManager authenticationManager(JwtAuthenticationProvider jwtAuthenticationProvider) {
        return new ProviderManager(Collections.singletonList(jwtAuthenticationProvider));
    }
    @Bean
    public JwtAuthenticationProvider jwtAuthenticationProvider(
            JwtDecoder jwtDecoder,
            WaitingJwtAuthenticationConverter waitingJwtAuthenticationConverter
    ) {
        JwtAuthenticationProvider jwtAuthenticationProvider = new JwtAuthenticationProvider(jwtDecoder);
        jwtAuthenticationProvider.setJwtAuthenticationConverter(waitingJwtAuthenticationConverter);
        return jwtAuthenticationProvider;
    }
    @Bean
    public JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        return NimbusJwtEncoder.withSecretKey(jwtSecretKey).build();
    }
    @Bean
    public JwtDecoder jwtDecoder(SecretKey jwtSecretKey) {
        return NimbusJwtDecoder.withSecretKey(jwtSecretKey).build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
