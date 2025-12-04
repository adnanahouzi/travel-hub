package com.travelhub.booking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bookingApiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Travel Hub Booking API")
                        .description("API for hotel booking and search operations powered by LiteAPI/Nuitee")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Travel Hub Team")
                                .email("support@travelhub.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development Server")
                ));
    }
}

