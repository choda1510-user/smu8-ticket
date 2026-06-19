package com.smu8.ticket.config;

import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("Authorization", new SecurityScheme()
                                .name("Authorization")
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.HEADER)
                                .bearerFormat("JWT")))
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("Swagger UI - practice") // API의 제목
                .description("Swagger UI 적용 예제") // API에 대한 설명
                .version("1.0.0"); // API의 버전
    }
}
