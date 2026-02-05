package com.jobportal.backend.service;

import com.jobportal.backend.dto.CandidateProfileRequest;
import com.jobportal.backend.dto.CandidateProfileResponse;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.model.CandidateProfile;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.CandidateProfileRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {
    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final ResumeService resumeService;
    private final SecurityUtils securityUtils;

    @Transactional
    public CandidateProfileResponse updateProfile(CandidateProfileRequest request, MultipartFile resume) throws IOException {
        String email = securityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElse(CandidateProfile.builder().user(user).build());

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setSkills(request.getSkills());
        profile.setExperience(request.getExperience());

        if (resume != null && !resume.isEmpty()) {
            String filename = resumeService.saveResume(resume);
            profile.setResumeUrl("/resumes/" + filename);
        }

        CandidateProfile savedProfile = candidateProfileRepository.save(profile);
        return convertToResponse(savedProfile);
    }

    public CandidateProfileResponse getProfileByUserId(Long userId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
        return convertToResponse(profile);
    }

    public CandidateProfileResponse convertToResponse(CandidateProfile profile) {
        return CandidateProfileResponse.builder()
                .id(profile.getId())
                .email(profile.getUser().getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .phone(profile.getPhone())
                .skills(profile.getSkills())
                .experience(profile.getExperience())
                .resumeUrl(profile.getResumeUrl())
                .build();
    }
}
