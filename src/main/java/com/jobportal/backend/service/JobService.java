package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public JobResponse createJob(JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        log.info("Creating new job posting: '{}' for company: '{}'", request.getTitle(), request.getCompanyName());
        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .companyName(request.getCompanyName())
                .location(request.getLocation())
                .salaryRange(request.getSalaryRange())
                .jobType(request.getJobType())
                .experienceLevel(request.getExperienceLevel())
                .recruiter(recruiter)
                .build();
        return convertToResponse(jobRepository.save(job));
    }

    public Page<JobResponse> getAllJobs(int page, int size, String sortBy, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        Page<Job> jobPage;
        if (search != null && !search.isEmpty()) {
            jobPage = jobRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(
                    search, search, pageable);
        } else {
            jobPage = jobRepository.findAll(pageable);
        }

        return jobPage.map(this::convertToResponse);
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return convertToResponse(job);
    }

    public void deleteJob(Long id) {
        log.warn("Soft-deleting job with ID: {}", id);

        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        // This will trigger the @SQLDelete update statement
        jobRepository.delete(job);
    }

    public List<JobResponse> getJobsByRecruiter(String email) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return jobRepository.findByRecruiter(recruiter).stream()
                .map(this::convertToResponse)
                .toList();
    }

    private JobResponse convertToResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .salaryRange(job.getSalaryRange())
                .jobType(job.getJobType())
                .experienceLevel(job.getExperienceLevel())
                .createdAt(job.getCreatedAt())
                .build();
    }
}