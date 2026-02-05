package com.jobportal.backend.service;

import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobService jobService;

    private Job sampleJob;

    @BeforeEach
    void setUp() {
        sampleJob = Job.builder()
                .id(1L)
                .title("Software Engineer")
                .companyName("Tech Corp")
                .jobType("Full time")
                .experienceLevel("Junior")
                .build();
    }

    @Test
    void getJobById_Success() {
        // Arrange
        when(jobRepository.findById(1L)).thenReturn(Optional.of(sampleJob));

        // Act
        JobResponse result = jobService.getJobById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Software Engineer", result.getTitle());
        verify(jobRepository, times(1)).findById(1L);
    }

    @Test
    void getJobById_NotFound_ThrowsException() {
        // Arrange
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> jobService.getJobById(99L));
        verify(jobRepository, times(1)).findById(99L);
    }
}