package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ApplicationRequest;
import com.jobportal.backend.dto.ApplicationResponse;
import com.jobportal.backend.dto.CandidateProfileResponse;
import com.jobportal.backend.dto.StatusHistoryResponse;
import com.jobportal.backend.model.Application;
import com.jobportal.backend.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')") // Only CANDIDATE can apply
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.ok(applicationService.applyToJob(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ApplicationResponse>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(userId));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationResponse>> getByRecruiter() {
        return ResponseEntity.ok(applicationService.getApplicationsForRecruiter());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam Application.ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<StatusHistoryResponse>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationStatusHistory(id));
    }

    @GetMapping("/{id}/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<CandidateProfileResponse> getCandidateProfile(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getCandidateProfileByApplicationId(id));
    }
}