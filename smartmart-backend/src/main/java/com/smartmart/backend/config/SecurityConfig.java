package com.smartmart.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors -> {})

            .authorizeHttpRequests(auth -> auth
                // Allow CORS preflight requests
                .requestMatchers(
                    org.springframework.http.HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Allow authentication APIs
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // Allow user APIs
                .requestMatchers(
                    "/api/users/**"
                ).permitAll()

                // Currently allow all SmartMart APIs
                .anyRequest().permitAll()
            );

        return http.build();
    }
}