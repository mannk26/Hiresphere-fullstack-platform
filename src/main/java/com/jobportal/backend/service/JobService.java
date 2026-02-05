package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.model.User;
import com.jobportal.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {
        private final JobRepository jobRepository;
        private final UserRepository userRepository;
        private final SecurityUtils securityUtils;

        @Transactional
        public JobResponse createJob(JobRequest request) {
                String email = securityUtils.getCurrentUserEmail();
                User recruiter = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                log.info("Creating new job posting: '{}' for company: '{}'", request.getTitle(),
                                request.getCompanyName());
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

        public Page<JobResponse> getAllJobs(int page, int size, String sortBy, String search, String jobType,
                        String experienceLevel) {
                log.info("Fetching jobs with filters - search: {}, jobType: {}, experienceLevel: {}, page: {}, size: {}",
                                search, jobType, experienceLevel, page, size);
                Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

                org.springframework.data.jpa.domain.Specification<Job> spec = com.jobportal.backend.repository.JobSpecification
                                .withFilters(search, jobType, experienceLevel);

                Page<Job> jobPage = jobRepository.findAll(spec, pageable);

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