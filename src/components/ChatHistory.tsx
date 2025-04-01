import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatHistoryProps {
  messages: Message[];
  isDark: boolean;
}

const HistoryContainer = styled.div`
  padding: 10px;
  height: calc(100vh - 140px);
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const MessageContainer = styled(motion.div)<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
`;

const MessageBubble = styled.div<{ $isUser: boolean; $isDark: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: ${props => props.$isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px'};
  background: ${props => props.$isUser 
    ? '#4FB6F2'
    : props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.$isUser ? '#fff' : 'inherit'};
  font-size: 0.95rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.7;
  text-align: center;
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
`;

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isDark }) => {
  if (messages.length === 0) {
    return (
      <EmptyState $isDark={isDark}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>No messages yet. Start chatting with your penguin friend!</p>
      </EmptyState>
    );
  }

  return (
    <HistoryContainer>
      {messages.map((message, index) => (
        <MessageContainer
          key={index}
          $isUser={message.isUser}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageBubble $isUser={message.isUser} $isDark={isDark}>
            {message.text}
          </MessageBubble>
        </MessageContainer>
      ))}
    </HistoryContainer>
  );
};

export default ChatHistory; 