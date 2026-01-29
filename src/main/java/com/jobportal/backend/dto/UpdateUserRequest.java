package com.jobportal.backend.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @Email(message = "Invalid email format")
    private String email;
    private String password; // Optional: only update if not null
    private String firstName;
    private String lastName;
    private String phone;
    private String bio;
}
