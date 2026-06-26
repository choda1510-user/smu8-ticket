package com.smu8.ticket.file.controller;

import com.smu8.ticket.file.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
public class FileController {
    private final StorageService storageService;

    @GetMapping("/api/images/{key:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String key) {
        Resource resource = storageService.loadAsResource(key);
        MediaType mediaType = resolveImageMediaType(key);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline()
                                .filename(key, StandardCharsets.UTF_8)
                                .build()
                                .toString()
                )
                .body(resource);
    }

    private MediaType resolveImageMediaType(String key) {
        String contentType = URLConnection.guessContentTypeFromName(key);

        if (contentType == null) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        if (!contentType.startsWith("image/")) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }

        return MediaType.parseMediaType(contentType);
    }
}
