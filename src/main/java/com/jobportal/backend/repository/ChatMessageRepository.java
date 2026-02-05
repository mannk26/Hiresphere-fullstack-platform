package com.jobportal.backend.repository;

import com.jobportal.backend.model.ChatMessage;
import com.jobportal.backend.model.ChatRoom;
import com.jobportal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoom);
    long countByChatRoomAndSenderRole(ChatRoom chatRoom, User.Role role);
    java.util.Optional<ChatMessage> findFirstByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);
    long countByChatRoomAndSenderNotAndIsReadFalse(ChatRoom chatRoom, User sender);

    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.chatRoom = :chatRoom AND m.sender != :user AND m.isRead = false")
    void markMessagesAsRead(ChatRoom chatRoom, User user);
}
