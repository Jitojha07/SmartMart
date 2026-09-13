package com.smartmart.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.smartmart.backend.entity.Role;
import com.smartmart.backend.entity.User;
import com.smartmart.backend.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    // ================= ADMIN CREDENTIALS =================

    private static final String ADMIN_EMAIL = System.getenv("ADMIN_EMAIL");

    private static final String ADMIN_PASSWORD = System.getenv("ADMIN_PASSWORD");

    // =====================================================

    public AdminInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {

        // Check whether admin already exists
        if (userRepository.findByEmail(ADMIN_EMAIL).isPresent()) {

            System.out.println(
                "========================================"
            );

            System.out.println(
                "SmartMart Admin already exists."
            );

            System.out.println(
                "Admin Email: " + ADMIN_EMAIL
            );

            System.out.println(
                "========================================"
            );

            return;
        }

        // ================= CREATE ADMIN =================

        User admin = new User();

        admin.setName("SmartMart Admin");
        admin.setEmail(ADMIN_EMAIL);

        // BCrypt encrypt password
        admin.setPassword(
            passwordEncoder.encode(ADMIN_PASSWORD)
        );

        admin.setRole(Role.ADMIN);

        userRepository.save(admin);

        System.out.println(
            "========================================"
        );

        System.out.println(
            "SmartMart Admin Created Successfully!"
        );

        System.out.println(
            "Admin Email: " + ADMIN_EMAIL
        );

        System.out.println(
            "Admin Role: ADMIN"
        );

        System.out.println(
            "========================================"
        );
    }
}