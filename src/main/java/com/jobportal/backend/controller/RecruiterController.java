package com.jobportal.backend.controller;

import com.jobportal.backend.dto.CandidateProfileResponse;
import com.jobportal.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recruiters/applications")
@RequiredArgsConstructor
public class RecruiterController {
    private final ApplicationService applicationService;

    @GetMapping("/{applicationId}/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<CandidateProfileResponse> getCandidateProfile(@PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.getCandidateProfileByApplicationId(applicationId));
    }
}
