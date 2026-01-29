package com.jobportal.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String skills;
    private String experience;
    private String resumeUrl;
}
