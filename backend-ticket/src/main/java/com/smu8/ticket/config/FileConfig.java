package com.smu8.ticket.config;

import com.smu8.ticket.file.config.StorageProperties;
import com.smu8.ticket.file.service.StorageService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(StorageProperties.class)
public class FileConfig {
    @Bean
    public CommandLineRunner init(StorageService storageService) {
        return args -> {
            storageService.init();
        };
    }
}
