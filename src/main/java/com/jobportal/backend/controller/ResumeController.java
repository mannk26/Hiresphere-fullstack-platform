package com.jobportal.backend.controller;

import com.jobportal.backend.model.CandidateProfile;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.CandidateProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Path;

@RestController
@RequestMapping("/resumes")
@RequiredArgsConstructor
public class ResumeController {
    private final ResumeService resumeService;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> getResume(@PathVariable String filename) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User currentUser = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String resumeUrl = "/resumes/" + filename;
            CandidateProfile profile = candidateProfileRepository.findByResumeUrl(resumeUrl)
                    .orElseThrow(() -> new RuntimeException("Resume record not found"));

            boolean isOwner = profile.getUser().getId().equals(currentUser.getId());
            boolean isRecruiterOfApplicant = currentUser.getRole() == User.Role.RECRUITER && 
                    applicationRepository.existsByUserIdAndJobRecruiterId(profile.getUser().getId(), currentUser.getId());
            boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;

            if (!isOwner && !isRecruiterOfApplicant && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Path file = resumeService.getResumePath(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = "application/octet-stream";
                try {
                    contentType = java.nio.file.Files.probeContentType(file);
                    if (contentType == null) {
                        contentType = "application/octet-stream";
                    }
                } catch (IOException ex) {
                    // Fallback to octet-stream
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
