package com.smu8.ticket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/*
 * service 아래는 항상 인터페이스와 인터페이스를 구현한 클래스가 있는 구조로 개발
 * controller에서는 항상 service 패키지의 인터페이스만 사용하여 의존성 주입을 받음
 */
@EnableJpaAuditing
@SpringBootApplication
public class TicketApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketApplication.class, args);
	}

}
