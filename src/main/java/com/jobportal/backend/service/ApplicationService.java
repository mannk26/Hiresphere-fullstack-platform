package com.jobportal.backend.service;

import com.jobportal.backend.dto.*;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.model.*;
import com.jobportal.backend.repository.*;
import com.jobportal.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final NotificationRepository notificationRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateProfileService candidateProfileService;
    private final SecurityUtils securityUtils;

    @Transactional
    public ApplicationResponse applyToJob(ApplicationRequest request) {
        String email = securityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if application already exists
        if (applicationRepository.existsByUserIdAndJobId(user.getId(), request.getJobId())) {
            throw new RuntimeException("You have already applied for this job.");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElse(null);

        // Proceed with application creation...
        Application application = Application.builder()
                .user(user)
                .job(job)
                .candidateProfile(profile)
                .status(Application.ApplicationStatus.APPLIED)
                .build();

        application = applicationRepository.save(application);

        // Record initial history
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .oldStatus(null)
                .newStatus(Application.ApplicationStatus.APPLIED)
                .updatedBy(user)
                .build();
        statusHistoryRepository.save(history);

        // Create notification for recruiter
        String recruiterMessage = String.format("New application received for %s from %s.", 
                job.getTitle(), user.getEmail());
        
        Notification recruiterNotification = Notification.builder()
                .user(job.getRecruiter())
                .message(recruiterMessage)
                .build();
        notificationRepository.save(recruiterNotification);

        return convertToResponse(application);
    }

    public List<ApplicationResponse> getApplicationsByUser(Long userId) {
        return applicationRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsForRecruiter() {
        String email = securityUtils.getCurrentUserEmail();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return applicationRepository.findByJobRecruiterId(recruiter.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long id, Application.ApplicationStatus status) {
        String email = securityUtils.getCurrentUserEmail();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        
        Application.ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(status);

        // Record history
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .oldStatus(oldStatus)
                .newStatus(status)
                .updatedBy(recruiter)
                .build();
        statusHistoryRepository.save(history);

        // Create notification for candidate
        String message = String.format("Your application for %s at %s was %s.", 
                application.getJob().getTitle(), 
                application.getJob().getCompanyName(), 
                status.toString().toLowerCase());
        
        Notification notification = Notification.builder()
                .user(application.getUser())
                .message(message)
                .build();
        notificationRepository.save(notification);

        return convertToResponse(applicationRepository.save(application));
    }

    public List<StatusHistoryResponse> getApplicationStatusHistory(Long applicationId) {
        return statusHistoryRepository.findByApplicationIdOrderByTimestampDesc(applicationId)
                .stream()
                .map(history -> StatusHistoryResponse.builder()
                        .id(history.getId())
                        .oldStatus(history.getOldStatus())
                        .newStatus(history.getNewStatus())
                        .updatedByEmail(history.getUpdatedBy().getEmail())
                        .timestamp(history.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    public CandidateProfileResponse getCandidateProfileByApplicationId(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        CandidateProfile profile = application.getCandidateProfile();
        if (profile == null) {
            // Try to fetch from user if not linked in application
            profile = candidateProfileRepository.findByUserId(application.getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        }

        return candidateProfileService.convertToResponse(profile);
    }


    private ApplicationResponse convertToResponse(Application app) {
        // Map nested Job to JobResponse
        JobResponse jobDto = JobResponse.builder()
                .id(app.getJob().getId())
                .title(app.getJob().getTitle())
                .companyName(app.getJob().getCompanyName())
                .location(app.getJob().getLocation())
                .build();

        // Fetch resumeUrl from linked profile or fallback to user's profile
        String resumeUrl = null;
        if (app.getCandidateProfile() != null && app.getCandidateProfile().getResumeUrl() != null) {
            resumeUrl = app.getCandidateProfile().getResumeUrl();
        } else {
            // Force fetch latest profile from repository in case it wasn't linked or was updated
            resumeUrl = candidateProfileRepository.findByUserId(app.getUser().getId())
                    .map(CandidateProfile::getResumeUrl)
                    .orElse(null);
        }

        return ApplicationResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .userEmail(app.getUser().getEmail())
                .resumeUrl(resumeUrl)
                .job(jobDto)
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .build();
    }

}