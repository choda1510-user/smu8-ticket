package com.smu8.ticket.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @Operation(summary = "테스트 API", description = "서버 응답 상태를 간단히 확인합니다.")
    @GetMapping("/api/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("hello world");
    }
}
