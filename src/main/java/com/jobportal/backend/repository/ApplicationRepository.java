package com.jobportal.backend.repository;

import com.jobportal.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    List<Application> findByJobRecruiterId(Long recruiterId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    
    @Query("SELECT COUNT(a) > 0 FROM Application a JOIN a.job j JOIN j.recruiter r WHERE a.user.id = :userId AND r.id = :recruiterId")
    boolean existsByUserIdAndJobRecruiterId(@Param("userId") Long userId, @Param("recruiterId") Long recruiterId);
}