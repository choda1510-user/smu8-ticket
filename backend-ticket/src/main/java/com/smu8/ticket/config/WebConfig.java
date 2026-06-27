package com.smu8.ticket.config;

import com.smu8.ticket.auth.config.CorsProperties;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableConfigurationProperties(CorsProperties.class)
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
    @Bean
    public WebMvcConfigurer corsLocalConfigurer(CorsProperties corsProperties) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins(corsProperties.getOrigins().toArray(String[]::new))
                        .allowedHeaders(corsProperties.getHeaders().toArray(String[]::new))
                        .allowedMethods(corsProperties.getMethods().toArray(String[]::new))
                        .allowCredentials(corsProperties.isCredentials());
            }
        };
    }
}
