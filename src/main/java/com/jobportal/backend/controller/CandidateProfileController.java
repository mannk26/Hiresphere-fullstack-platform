package com.jobportal.backend.controller;

import com.jobportal.backend.dto.CandidateProfileRequest;
import com.jobportal.backend.dto.CandidateProfileResponse;
import com.jobportal.backend.service.CandidateProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/candidates")
@RequiredArgsConstructor
public class CandidateProfileController {
    private final CandidateProfileService candidateProfileService;

    @PostMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<CandidateProfileResponse> updateProfile(
            @RequestPart("profile") CandidateProfileRequest request,
            @RequestPart(value = "resume", required = false) MultipartFile resume) throws IOException {
        return ResponseEntity.ok(candidateProfileService.updateProfile(request, resume));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<CandidateProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(candidateProfileService.getProfileByUserId(userId));
    }
}
