package com.smu8.ticket.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.servlet.config.annotation.CorsRegistration;

import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    private List<String> origins;
    private List<String> headers;
    private List<String> methods;
    private boolean credentials;

    public void addAllowedOrigins(CorsRegistration registration) {
        registration.allowedOrigins(origins.toArray(String[]::new));
    }
    public void addAllowedHeaders(CorsRegistration registration) {
        registration.allowedOrigins(headers.toArray(String[]::new));
    }
    public void addAllowedMethods(CorsRegistration registration) {
        registration.allowedMethods(methods.toArray(String[]::new));
    }
    public void allowCredentials(CorsRegistration registration) {
        registration.allowCredentials(credentials);
    }
    public CorsRegistration apply(CorsRegistration registration) {
        addAllowedOrigins(registration);
        addAllowedHeaders(registration);
        addAllowedMethods(registration);
        allowCredentials(registration);
        System.out.println(origins);
        System.out.println(headers);
        System.out.println(methods);
        System.out.println(credentials);
        return registration;
    }
}
