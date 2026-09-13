package com.smartmart.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartmart.backend.entity.Role;
import com.smartmart.backend.entity.User;
import com.smartmart.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        try {

            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {

                Map<String, String> response = new HashMap<>();

                response.put(
                    "message",
                    "Email already registered"
                );

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(response);
            }

            // ================= ROLE VALIDATION =================

            Role role;

            if (request.getRole() == null ||
                request.getRole().isBlank()) {

                // Default role
                role = Role.CUSTOMER;

            } else {

                role = Role.valueOf(
                    request.getRole().toUpperCase()
                );
            }

            /*
             * ADMIN accounts cannot be created
             * through public registration.
             */
            if (role == Role.ADMIN) {

                Map<String, String> response = new HashMap<>();

                response.put(
                    "message",
                    "Admin accounts cannot be created through registration."
                );

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(response);
            }

            // ================= CREATE USER =================

            User user = new User();

            user.setName(request.getName());
            user.setEmail(request.getEmail());

            // Encrypt password
            user.setPassword(
                passwordEncoder.encode(
                    request.getPassword()
                )
            );

            user.setRole(role);

            User savedUser = userRepository.save(user);

            // ================= RESPONSE =================

            Map<String, Object> response = new HashMap<>();

            response.put("id", savedUser.getId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            response.put(
                "message",
                "Registration successful"
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (IllegalArgumentException e) {

            Map<String, String> response = new HashMap<>();

            response.put(
                "message",
                "Invalid role. Only CUSTOMER or SELLER is allowed."
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);

        } catch (Exception e) {

            Map<String, String> response = new HashMap<>();

            response.put(
                "message",
                "Registration failed: " + e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }


    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            User user = userRepository
                    .findByEmail(request.getEmail())
                    .orElse(null);

            if (user == null) {

                Map<String, String> response = new HashMap<>();

                response.put(
                    "message",
                    "Invalid email or password"
                );

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(response);
            }

            // ================= CHECK PASSWORD =================

            boolean passwordMatches =
                    passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                    );

            if (!passwordMatches) {

                Map<String, String> response = new HashMap<>();

                response.put(
                    "message",
                    "Invalid email or password"
                );

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(response);
            }

            // ================= SUCCESSFUL LOGIN =================

            Map<String, Object> response = new HashMap<>();

            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put(
                "message",
                "Login successful"
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            Map<String, String> response = new HashMap<>();

            response.put(
                "message",
                "Login failed: " + e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }


    // ================= REGISTER REQUEST =================

    public static class RegisterRequest {

        private String name;
        private String email;
        private String password;
        private String role;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }


    // ================= LOGIN REQUEST =================

    public static class LoginRequest {

        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}