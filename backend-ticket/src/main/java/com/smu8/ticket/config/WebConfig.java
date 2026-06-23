package com.smu8.ticket.config;

import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
//    @Override
//    public void configurePathMatch(PathMatchConfigurer pathMatchConfigurer) {
//        pathMatchConfigurer.addPathPrefix("/api", HandlerTypePredicate.forBasePackage(
//                "com.smu8.ticket.controller",
//                "com.smu8.ticket.account.controller",
//                "com.smu8.ticket.concert.controller"));
//    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/{*path}").addResourceLocations("classpath:/static/");
        registry.addResourceHandler("swagger-ui.html").addResourceLocations("classpath:/static/swagger-ui/");
    }
    @Profile("local")
    @Bean
    public WebMvcConfigurer corsLocalConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:80", "http://localhost", "http://192.168.0.6:80", "http://192.168.0.6")
                        .allowedHeaders("Content-Type", "Authorization")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                        .allowCredentials(true);
            }
        };
    }
    @Profile("dev")
    @Bean
    public WebMvcConfigurer corsDevConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:80", "http://localhost", "http://192.168.0.6:80", "http://192.168.0.6")
                        .allowedHeaders("Content-Type", "Authorization")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                        .allowCredentials(true);
            }
        };
    }
    @Profile("test")
    @Bean
    public WebMvcConfigurer corsTestConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://192.168.0.6:80", "http://192.168.0.6")
                        .allowedHeaders("Content-Type", "Authorization")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                        .allowCredentials(true);
            }
        };
    }
}
