package com.jobportal.backend.controller;

import com.jobportal.backend.model.CandidateProfile;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.CandidateProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
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
            // Decode filename in case it's URL encoded
            String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.toString());
            log.info("Request to view resume: {} (decoded: {})", filename, decodedFilename);
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
//            if (auth == null || !auth.isAuthenticated() || auth.getName().equals("anonymousUser")) {
//                log.warn("Unauthorized access attempt to resume: {}", decodedFilename);
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//            }

            String email = auth.getName();
            User currentUser = userRepository.findByEmail(email)
                   .orElseThrow(() -> new RuntimeException("Current user not found: " + email));

            // Try to find profile by full URL or just filename
            String resumeUrl = "/resumes/" + decodedFilename;
            CandidateProfile profile = candidateProfileRepository.findByResumeUrl(resumeUrl)
                    .or(() -> candidateProfileRepository.findByResumeFilename(decodedFilename))
                    .or(() -> candidateProfileRepository.findByResumeUrl("/resumes/" + filename))
                    .or(() -> candidateProfileRepository.findByResumeFilename(filename))
                    .orElseThrow(() -> new RuntimeException("Resume record not found for: " + decodedFilename));

            boolean isOwner = profile.getUser().getId().equals(currentUser.getId());
            boolean isRecruiterOfApplicant = false;
            if (currentUser.getRole() == User.Role.RECRUITER) {
                isRecruiterOfApplicant = applicationRepository.existsByUserIdAndJobRecruiterId(profile.getUser().getId(), currentUser.getId());
                log.info("Recruiter permission check: candidateId={}, recruiterId={}, hasApplication={}", 
                        profile.getUser().getId(), currentUser.getId(), isRecruiterOfApplicant);
            }
            boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;

            log.info("Access Check: user={}, role={}, isOwner={}, isRecruiterOfApplicant={}, isAdmin={}", 
                    email, currentUser.getRole(), isOwner, isRecruiterOfApplicant, isAdmin);

            if (!isOwner && !isRecruiterOfApplicant && !isAdmin) {
                log.warn("Access DENIED for resume: {} by user: {}. No application link found for candidate {} and recruiter {}", 
                        decodedFilename, email, profile.getUser().getId(), currentUser.getId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Path file = resumeService.getResumePath(decodedFilename);
            if (!Files.exists(file)) {
                file = resumeService.getResumePath(filename);
            }
            
            log.info("Resolved resume path: {}", file.toAbsolutePath());
            
            if (!Files.exists(file)) {
                log.error("File does not exist on disk: {}", file.toAbsolutePath());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(Files.size(file)))
                        .body(resource);
            } else {
                log.error("Could not read file: {}", decodedFilename);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            log.error("Error viewing resume {}: {}", filename, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
