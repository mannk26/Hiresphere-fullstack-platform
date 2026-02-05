import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ChatContextType {
  isChatOpen: boolean;
  initialRoomId: number | null;
  openChat: (roomId?: number | null) => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialRoomId, setInitialRoomId] = useState<number | null>(null);

  const openChat = (roomId: number | null = null) => {
    setInitialRoomId(roomId);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setInitialRoomId(null);
  };

  return (
    <ChatContext.Provider value={{ isChatOpen, initialRoomId, openChat, closeChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
