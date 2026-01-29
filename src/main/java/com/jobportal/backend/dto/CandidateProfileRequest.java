package com.jobportal.backend.dto;

import lombok.Data;

@Data
public class CandidateProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String skills;
    private String experience;
}
