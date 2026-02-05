package com.jobportal.backend.config;

import com.jobportal.backend.model.User;
import com.jobportal.backend.service.ChatService;
import com.jobportal.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final UserService userService;
    private final ChatService chatService;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor == null) return message;

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        if (jwtService.isTokenValid(token)) {
                            String email = jwtService.extractEmail(token);
                            User user = userService.findByEmail(email);
                            List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                                    new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                            );
                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                    user, null, authorities
                            );
                            accessor.setUser(auth);
                            // Set for current thread (CONNECT handling)
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    }
                } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    String destination = accessor.getDestination();
                    if (destination == null) return message;

                    UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) accessor.getUser();
                    if (auth == null) {
                        throw new RuntimeException("Unauthorized: User not authenticated");
                    }
                    User user = (User) auth.getPrincipal();
                    SecurityContextHolder.getContext().setAuthentication(auth);

                    if (destination.startsWith("/topic/chat/")) {
                        Long roomId = Long.parseLong(destination.substring("/topic/chat/".length()));
                        if (!chatService.isUserInRoom(roomId, user.getId())) {
                            throw new RuntimeException("Unauthorized: You are not a member of this chat room");
                        }
                    } else if (destination.startsWith("/topic/user/")) {
                        String[] parts = destination.split("/");
                        if (parts.length >= 4 && parts[2].equals("user")) {
                            Long userId = Long.parseLong(parts[3]);
                            if (!user.getId().equals(userId)) {
                                throw new RuntimeException("Unauthorized: You can only subscribe to your own notifications");
                            }
                        }
                    }
                } else if (StompCommand.SEND.equals(accessor.getCommand())) {
                    UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) accessor.getUser();
                    if (auth != null) {
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
                return message;
            }

            @Override
            public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
                // Clear context after message is processed to avoid thread pollution
                SecurityContextHolder.clearContext();
            }
        });
    }
}
