package com.jobportal.backend.repository;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    Page<Job> findAll(Pageable pageable);

    List<Job> findByRecruiter(User recruiter);
    Page<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String title, String location, Pageable pageable);

}