package com.jobportal.backend.controller;

import com.jobportal.backend.dto.UpdateUserRequest;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.UserService;
import com.jobportal.backend.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile() {
        String email = securityUtils.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/updateProfile")
    public ResponseEntity<User> updateProfile(@Valid @RequestBody UpdateUserRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

}