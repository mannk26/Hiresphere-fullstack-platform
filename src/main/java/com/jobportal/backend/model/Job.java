package com.jobportal.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
//import org.hibernate.annotations.Where;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// Overrides the default delete command with an update command
@SQLDelete(sql = "UPDATE jobs SET deleted = true WHERE id=?")
// Automatically filters out "deleted" records from every SELECT query
@SQLRestriction("deleted = false")
public class Job extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String companyName;
    private String location;
    private String salaryRange;
    private String jobType;
    private String experienceLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    @Builder.Default
    private boolean deleted = Boolean.FALSE;

//    @Column(updatable = false)
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
}