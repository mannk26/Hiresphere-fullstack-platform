package com.jobportal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDTO {
    private Long id;
    private Long recruiterId;
    private String recruiterName;
    private Long candidateId;
    private String candidateName;
    private String lastMessage;
    private java.time.LocalDateTime lastMessageTimestamp;
    private Long unreadCount;
}
