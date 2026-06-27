package com.smu8.ticket.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@Getter
@Setter
@ConfigurationProperties(prefix = "cors")
public class CorsProperties {
    private List<String> origins;
    private List<String> headers;
    private List<String> methods;
    private boolean credentials;
}
