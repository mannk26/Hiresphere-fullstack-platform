package com.jobportal.backend.repository;

import com.jobportal.backend.model.ChatRoom;
import com.jobportal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByRecruiterAndCandidate(User recruiter, User candidate);
    List<ChatRoom> findByRecruiter(User recruiter);
    List<ChatRoom> findByCandidate(User candidate);
}
