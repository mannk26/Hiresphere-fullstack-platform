package com.jobportal.backend.repository;

import com.jobportal.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    List<Application> findByJobRecruiterId(Long recruiterId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    boolean existsByUserIdAndJobRecruiterId(Long userId, Long recruiterId);
}