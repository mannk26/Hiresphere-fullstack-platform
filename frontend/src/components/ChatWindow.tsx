import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, over } from 'stompjs';
import { useAuth } from '../hooks/useAuth';
import { chatService } from '../services/chat.service';
import { type ChatRoom, type ChatMessage } from '../types';
import { API_URL } from '../api/axios';
import { Send, X, MessageSquare, User, Loader2, Minimize2 } from 'lucide-react';
import { format } from 'date-fns';

interface ChatWindowProps {
  onClose: () => void;
  initialRoomId?: number | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, initialRoomId }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionsRef = useRef<{ [key: number]: any }>({});
  const activeRoomRef = useRef<ChatRoom | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    fetchRooms();
  }, [initialRoomId]);

  useEffect(() => {
    if (rooms.length > 0) {
      if (initialRoomId) {
        const room = rooms.find(r => r.id === initialRoomId);
        if (room && room.id !== activeRoom?.id) {
          setActiveRoom(room);
        }
      } else if (!activeRoom) {
        setActiveRoom(rooms[0]);
      }
    }
  }, [rooms, initialRoomId, activeRoom?.id]);

  useEffect(() => {
    activeRoomRef.current = activeRoom;
    if (activeRoom) {
      fetchHistory(activeRoom.id);
      // Reset unread count for active room locally
      const roomWithUnread = rooms.find(r => r.id === activeRoom.id && (r.unreadCount || 0) > 0);
      if (roomWithUnread) {
        setRooms(prev => prev.map(r => 
          r.id === activeRoom.id ? { ...r, unreadCount: 0 } : r
        ));
      }
    }
  }, [activeRoom]);

  useEffect(() => {
    if (user && !stompClientRef.current) {
      connectToWebSocket();
    }
    return () => {
      if (stompClientRef.current) {
        Object.values(subscriptionsRef.current).forEach((sub: any) => sub.unsubscribe());
        subscriptionsRef.current = {};
        if (stompClientRef.current.connected) {
          stompClientRef.current.disconnect(() => {});
        }
        stompClientRef.current = null;
        setIsConnected(false);
      }
    };
  }, [user]);

  useEffect(() => {
    if (user && isConnected && stompClientRef.current && stompClientRef.current.connected) {
      // Subscribe to user notifications (e.g., new chat rooms)
      const sub = stompClientRef.current.subscribe(`/topic/user/${user.id}/notifications`, (payload) => {
        const newRoom = JSON.parse(payload.body);
        setRooms(prev => {
          if (prev.find(r => r.id === newRoom.id)) return prev;
          return [newRoom, ...prev];
        });
      });

      return () => {
        sub.unsubscribe();
      };
    }
  }, [user, isConnected]);

  useEffect(() => {
    if (!isConnected) {
      // Clear local subscription tracking when disconnected
      Object.values(subscriptionsRef.current).forEach((sub: any) => {
        try { sub.unsubscribe(); } catch (e) {}
      });
      subscriptionsRef.current = {};
    }
  }, [isConnected]);

  useEffect(() => {
    if (rooms.length > 0 && isConnected && stompClientRef.current?.connected) {
      rooms.forEach(room => {
        if (!subscriptionsRef.current[room.id]) {
          try {
            console.log(`Subscribing to room ${room.id}`);
            const sub = stompClientRef.current.subscribe(`/topic/chat/${room.id}`, (payload) => {
              const message = JSON.parse(payload.body);
              const isFromMe = message.senderId === user?.id;
              
              if (activeRoomRef.current?.id === room.id) {
                setMessages(prev => [...prev, message]);
                if (!isFromMe) {
                  chatService.markAsRead(room.id);
                }
              }
              
              setRooms(prevRooms => prevRooms.map(r => 
                r.id === room.id 
                  ? { 
                      ...r, 
                      lastMessage: message.content, 
                      lastMessageTimestamp: message.timestamp,
                      unreadCount: (activeRoomRef.current?.id === room.id || isFromMe) ? 0 : (Number(r.unreadCount) || 0) + 1
                    }
                  : r
              ));
            });
            if (sub) {
              subscriptionsRef.current[room.id] = sub;
            }
          } catch (error) {
            console.error('Error subscribing to room:', room.id, error);
          }
        }
      });
    }
  }, [rooms, isConnected, user?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const data = await chatService.getMyChatRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchHistory = async (roomId: number) => {
    setLoadingMessages(true);
    try {
      const data = await chatService.getChatHistory(roomId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const connectToWebSocket = () => {
    const socket = new SockJS(`${API_URL}/ws`);
    stompClientRef.current = over(socket);
    stompClientRef.current.debug = () => {};

    const headers = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };

    stompClientRef.current.connect(headers, () => {
      setIsConnected(true);
    }, (error) => {
      console.error('WebSocket connection error', error);
      setIsConnected(false);
      setTimeout(connectToWebSocket, 5000);
    });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeRoom && isConnected && stompClientRef.current) {
      const chatMessage: ChatMessage = {
        chatRoomId: activeRoom.id,
        content: newMessage.trim(),
      };
      
      stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
      setNewMessage('');
    }
  };

  const canSendMessage = () => {
    if (!activeRoom || !user) return false;
    if (user.role === 'RECRUITER') return true;
    
    // Candidate can only send if there is at least one message from a recruiter
    // In our simplified model, the recruiter is fixed for the room.
    // We can check the message history.
    return messages.some(msg => msg.senderId === activeRoom.recruiterId);
  };

  const isInputDisabled = !isConnected || !activeRoom || !canSendMessage();

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[100]">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 hover:bg-primary transition-all active:scale-95"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="font-black text-sm uppercase tracking-widest">Messages</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] w-[90vw] md:w-[800px] h-[600px] bg-white rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-gray-100 flex overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
      {/* Sidebar - Room List */}
      <div className="w-1/3 border-r border-gray-50 flex flex-col bg-gray-50/30">
        <div className="p-6 border-b border-gray-50 bg-white">
          <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Chats
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingRooms ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 text-gray-300 animate-spin" />
            </div>
          ) : rooms.length > 0 ? (
            rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
                  activeRoom?.id === room.id 
                    ? 'bg-white shadow-lg shadow-gray-200/50 border border-gray-100' 
                    : 'hover:bg-white/50 text-gray-500'
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeRoom?.id === room.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className={`font-black text-sm truncate ${activeRoom?.id === room.id ? 'text-gray-900' : ''}`}>
                    {user?.role === 'RECRUITER' ? room.candidateName : room.recruiterName}
                  </p>
                  {room.lastMessage ? (
                    <p className="text-[10px] text-gray-500 truncate max-w-[150px]">
                      {room.lastMessage}
                    </p>
                  ) : (
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                      {user?.role === 'RECRUITER' ? 'Candidate' : 'Recruiter'}
                    </p>
                  )}
                </div>
                {room.lastMessageTimestamp && (
                  <div className="ml-auto flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-[8px] font-black text-gray-300 uppercase">
                      {format(new Date(room.lastMessageTimestamp), 'HH:mm')}
                    </span>
                    {room.unreadCount && room.unreadCount > 0 ? (
                      <span className="h-4 w-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce">
                        {room.unreadCount}
                      </span>
                    ) : null}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-10 px-4">
              <p className="text-xs text-gray-400 font-bold">No conversations yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          {activeRoom ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-black text-gray-900 leading-none">
                   {user?.role === 'RECRUITER' ? activeRoom.candidateName : activeRoom.recruiterName}
                </h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {isConnected ? 'Live Connection' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
          {activeRoom ? (
            loadingMessages ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Syncing History...</p>
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] space-y-1`}>
                      <div className={`p-4 rounded-[20px] shadow-sm ${
                        isMe 
                          ? 'bg-gray-900 text-white rounded-br-none' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                      </div>
                      <p className={`text-[9px] font-black uppercase tracking-widest text-gray-400 px-1 ${isMe ? 'text-right' : ''}`}>
                        {msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : 'Just now'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <div className="h-16 w-16 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                  <MessageSquare className="h-8 w-8 text-gray-300" />
                </div>
                <h5 className="font-black text-gray-900 mb-2">Start the conversation</h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {user?.role === 'CANDIDATE' 
                    ? "Candidates can only reply after the recruiter sends a message." 
                    : "Send your first message to this candidate to initiate a live chat session."}
                </p>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p className="font-black text-sm uppercase tracking-[0.2em]">Select a room to start chatting</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-50">
          <form onSubmit={sendMessage} className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                !isConnected 
                  ? "Connecting..." 
                  : !canSendMessage() 
                    ? "Waiting for recruiter's first message..." 
                    : "Write a message..."
              }
              disabled={isInputDisabled}
              className="w-full pl-6 pr-16 py-4 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[20px] text-sm font-medium transition-all outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isInputDisabled}
              className="absolute right-2 top-2 h-12 w-12 bg-gray-900 text-white rounded-[16px] flex items-center justify-center hover:bg-primary transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-gray-900"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          {!isConnected && activeRoom && (
            <p className="mt-2 text-[9px] text-amber-600 font-black uppercase tracking-widest flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Reconnecting to uplink...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
