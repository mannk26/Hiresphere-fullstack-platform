package com.jobportal.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String companyName;
    private String location;
    private String salaryRange;
    private String jobType;
    private String experienceLevel;
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;
}