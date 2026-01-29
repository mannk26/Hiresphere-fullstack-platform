package com.jobportal.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationRequest {
    @NotNull(message = "Job ID is required")
    private Long jobId;

    private LocalDateTime lastModifiedAt;
}