package com.smu8.ticket.file.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Setter
@Getter
@ConfigurationProperties
public class StorageProperties {
    private String location = "upload-dir";

}
