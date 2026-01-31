package com.jobportal.backend.repository;

import com.jobportal.backend.model.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUserId(Long userId);
    Optional<CandidateProfile> findByResumeUrl(String resumeUrl);
    
    @Query("SELECT p FROM CandidateProfile p WHERE p.resumeUrl LIKE %:filename")
    Optional<CandidateProfile> findByResumeFilename(@Param("filename") String filename);
}
