package com.smartmart.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartmart.backend.entity.Role;
import com.smartmart.backend.entity.User;
import com.smartmart.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(
                    () -> new RuntimeException("User not found")
                );
    }

    public User createUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                "Email already registered"
            );
        }

        if (user.getRole() == null) {
            user.setRole(Role.CUSTOMER);
        }

        return userRepository.save(user);
    }
}