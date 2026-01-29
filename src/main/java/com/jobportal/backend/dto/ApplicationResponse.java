package com.jobportal.backend.dto;

import com.jobportal.backend.model.Application.ApplicationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private JobResponse job; // Nested DTO
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}