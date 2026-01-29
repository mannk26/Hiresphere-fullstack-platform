package com.jobportal.backend.service;

import com.jobportal.backend.config.JwtService;
import com.jobportal.backend.dto.LoginRequest;
import com.jobportal.backend.dto.RegisterRequest;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {
        log.info("Attempting to register new user with email: {} and role: {}", request.getEmail(), request.getRole());
        try {
            if(userRepository.existsByEmail(request.getEmail())) {
                log.warn("Registration failed: Email {} already exists", request.getEmail());
                throw new RuntimeException("Email already exists");
            }
            User user = User.builder()
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword())) // Hashed
                    .role(request.getRole())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .build();
            userRepository.save(user);
            log.info("User registered successfully: {}", request.getEmail());
            return jwtService.generateToken(user.getEmail());
        } catch (Exception e) {
            log.error("Error during registration for email {}: {}", request.getEmail(), e.getMessage(), e);
            throw e;
        }
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return jwtService.generateToken(user.getEmail());
    }
}
