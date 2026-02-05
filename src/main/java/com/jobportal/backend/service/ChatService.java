package com.jobportal.backend.service;

import com.jobportal.backend.dto.ChatMessageDTO;
import com.jobportal.backend.dto.ChatRoomDTO;
import com.jobportal.backend.exception.ResourceNotFoundException;
import com.jobportal.backend.model.ChatMessage;
import com.jobportal.backend.model.ChatRoom;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ChatMessageRepository;
import com.jobportal.backend.repository.ChatRoomRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public ChatRoomDTO initiateChat(Long candidateId) {
        User recruiter = getCurrentUser();
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (recruiter.getRole() != User.Role.RECRUITER) {
            throw new RuntimeException("Only recruiters can initiate chat");
        }

        ChatRoom chatRoom = chatRoomRepository.findByRecruiterAndCandidate(recruiter, candidate)
                .orElseGet(() -> {
                    ChatRoom newRoom = ChatRoom.builder()
                            .recruiter(recruiter)
                            .candidate(candidate)
                            .build();
                    return chatRoomRepository.save(newRoom);
                });

        return mapToChatRoomDTO(chatRoom, recruiter);
    }

    @Transactional(readOnly = true)
    public List<ChatRoomDTO> getUserChatRooms() {
        User user = getCurrentUser();

        List<ChatRoom> rooms;
        if (user.getRole() == User.Role.RECRUITER) {
            rooms = chatRoomRepository.findByRecruiter(user);
        } else {
            rooms = chatRoomRepository.findByCandidate(user);
        }

        return rooms.stream().map(room -> mapToChatRoomDTO(room, user)).collect(Collectors.toList());
    }

    @Transactional
    public List<ChatMessageDTO> getChatHistory(Long chatRoomId) {
        User user = getCurrentUser();
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        if (!isUserInRoom(chatRoom, user.getId())) {
            throw new RuntimeException("Unauthorized to view this chat history");
        }

        // When user opens chat history, we can also mark messages as read
        markAsRead(chatRoomId);

        return chatMessageRepository.findByChatRoomOrderByCreatedAtAsc(chatRoom)
                .stream().map(this::mapToChatMessageDTO).collect(Collectors.toList());
    }

    private User getCurrentUser() {
        String email = securityUtils.getCurrentUserEmail();
        log.info("Current user: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public void markAsRead(Long chatRoomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));
        User user = getCurrentUser();

        if (!isUserInRoom(chatRoom, user.getId())) {
            throw new RuntimeException("Unauthorized to mark messages as read");
        }

        chatMessageRepository.markMessagesAsRead(chatRoom, user);
    }

    @Transactional
    public ChatMessageDTO saveMessage(ChatMessageDTO messageDTO) {
        User sender = getCurrentUser();
        return saveMessage(messageDTO, sender);
    }

    @Transactional
    public ChatMessageDTO saveMessage(ChatMessageDTO messageDTO, User sender) {
        ChatRoom chatRoom = chatRoomRepository.findById(messageDTO.getChatRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found"));

        if (!isUserInRoom(chatRoom, sender.getId())) {
            throw new RuntimeException("Sender is not part of this chat room");
        }

        // Check if candidate is replying but recruiter hasn't sent a message yet
        if (sender.getRole() == User.Role.CANDIDATE) {
            long recruiterMessageCount = chatMessageRepository.countByChatRoomAndSenderRole(chatRoom,
                    User.Role.RECRUITER);
            if (recruiterMessageCount == 0) {
                throw new RuntimeException("Candidate cannot reply until recruiter sends the first message");
            }
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(messageDTO.getContent())
                .build();

        return mapToChatMessageDTO(chatMessageRepository.save(chatMessage));
    }

    public boolean isUserInRoom(Long chatRoomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElse(null);
        if (chatRoom == null)
            return false;
        return isUserInRoom(chatRoom, userId);
    }

    private boolean isUserInRoom(ChatRoom chatRoom, Long userId) {
        return chatRoom.getRecruiter().getId().equals(userId) ||
                chatRoom.getCandidate().getId().equals(userId);
    }

    private ChatRoomDTO mapToChatRoomDTO(ChatRoom chatRoom, User currentUser) {
        ChatRoomDTO dto = ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .recruiterId(chatRoom.getRecruiter().getId())
                .recruiterName(chatRoom.getRecruiter().getFirstName() + " " + chatRoom.getRecruiter().getLastName())
                .candidateId(chatRoom.getCandidate().getId())
                .candidateName(chatRoom.getCandidate().getFirstName() + " " + chatRoom.getCandidate().getLastName())
                .unreadCount(chatMessageRepository.countByChatRoomAndSenderNotAndIsReadFalse(chatRoom, currentUser))
                .build();

        chatMessageRepository.findFirstByChatRoomOrderByCreatedAtDesc(chatRoom).ifPresent(lastMsg -> {
            dto.setLastMessage(lastMsg.getContent());
            dto.setLastMessageTimestamp(lastMsg.getCreatedAt());
        });

        return dto;
    }

    private ChatMessageDTO mapToChatMessageDTO(ChatMessage message) {
        return ChatMessageDTO.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .senderId(message.getSender().getId())
                .content(message.getContent())
                .timestamp(message.getCreatedAt())
                .isRead(message.isRead())
                .build();
    }
}
