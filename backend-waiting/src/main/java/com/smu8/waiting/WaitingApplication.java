package com.smu8.waiting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// 대기열 조회
// 대기열 등록
// 대기열 통과
@SpringBootApplication
@EnableScheduling
public class WaitingApplication {

	public static void main(String[] args) {
		SpringApplication.run(WaitingApplication.class, args);
	}

}
