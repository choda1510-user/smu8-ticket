package com.smu8.ticket.config;

import com.smu8.ticket.account.service.AccountAuthenticationService;
import com.smu8.ticket.account.service.AccountServiceImpl;
import com.smu8.ticket.authentication.AccountAuthenticationConvertor;
import com.smu8.ticket.authentication.AccountAuthenticationProvider;
import org.jspecify.annotations.NullMarked;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

@EnableWebSecurity
@Configuration
public class SecurityConfig {
    @Bean
    public SecretKey jwtSecretKey(
            @Value("classpath:jwt-secret-key") Resource secretKeyResource
    ) throws IOException {
        String base64Secret = StreamUtils.copyToString(
                secretKeyResource.getInputStream(),
                StandardCharsets.UTF_8
        ).trim();

        byte[] keyBytes = Base64.getDecoder().decode(base64Secret);

        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT HS256 secret key must be at least 32 bytes.");
        }

        return new SecretKeySpec(keyBytes, "HmacSHA256");
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter) throws Exception {
        return http.securityMatcher("/api")
                .authorizeHttpRequests((authorize) -> {
                    authorize
                            .requestMatchers(HttpMethod.GET, "/test").permitAll()
                            .anyRequest().authenticated();
                })
                .sessionManagement((session) ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .httpBasic(Customizer.withDefaults())
                .formLogin(AbstractHttpConfigurer::disable)
                .addFilterBefore(bearerTokenAuthenticationFilter, AuthorizationFilter.class)
                .build();
    }

    @Bean
    public BearerTokenAuthenticationFilter bearerTokenAuthenticationFilter(AuthenticationManager authenticationManager) {
        return new BearerTokenAuthenticationFilter(authenticationManager);
    }
    @Bean
    public UserDetailsService userDetailsService(AccountServiceImpl accountService) {
        return new UserDetailsService() {
            @NullMarked
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return accountService.loadUserByUsername(username);
            }
        };
    }
    @Bean
    public JwtAuthenticationProvider jwtAuthenticationProvider(JwtDecoder jwtDecoder, AccountAuthenticationService accountService) {
        JwtAuthenticationProvider provider = new JwtAuthenticationProvider(jwtDecoder);
        provider.setJwtAuthenticationConverter(new AccountAuthenticationConvertor(accountService));
        return provider;
    }
    @Bean
    public AuthenticationManager authenticationManager(JwtAuthenticationProvider jwtAuthenticationProvider, AccountAuthenticationProvider accountAuthenticationProvider) {
        return new ProviderManager(jwtAuthenticationProvider, accountAuthenticationProvider);
    }
    @Bean
    public AccountAuthenticationProvider accountAuthenticationProvider(AccountAuthenticationService accountService, PasswordEncoder passwordEncoder) {
        return new AccountAuthenticationProvider(accountService, passwordEncoder);
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
