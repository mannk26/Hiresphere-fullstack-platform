package com.jobportal.backend.dto;

import com.jobportal.backend.model.Application;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusHistoryResponse {
    private Long id;
    private Application.ApplicationStatus oldStatus;
    private Application.ApplicationStatus newStatus;
    private String updatedByEmail;
    private LocalDateTime timestamp;
}
