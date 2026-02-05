package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ChatMessageDTO;
import com.jobportal.backend.dto.ChatRoomDTO;
import com.jobportal.backend.dto.InitiateChatRequest;
import com.jobportal.backend.model.User;
import com.jobportal.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageExceptionHandler
    public void handleException(Exception exception) {
        log.error("Error in chat websocket: {}", exception.getMessage(), exception);
    }

    @PostMapping("/initiate")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ChatRoomDTO> initiateChat(@RequestBody InitiateChatRequest request) {
        ChatRoomDTO chatRoom = chatService.initiateChat(request.getCandidateId());
        // Notify candidate about the new chat room
        messagingTemplate.convertAndSend("/topic/user/" + chatRoom.getCandidateId() + "/notifications", chatRoom);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomDTO>> getMyChatRooms() {
        return ResponseEntity.ok(chatService.getUserChatRooms());
    }

    @GetMapping("/rooms/{roomId}/history")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getChatHistory(roomId));
    }

    @PostMapping("/rooms/{roomId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long roomId) {
        chatService.markAsRead(roomId);
        return ResponseEntity.ok().build();
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageDTO chatMessageDTO, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        ChatMessageDTO savedMessage = chatService.saveMessage(chatMessageDTO, user);
        messagingTemplate.convertAndSend("/topic/chat/" + savedMessage.getChatRoomId(), savedMessage);
    }
}
