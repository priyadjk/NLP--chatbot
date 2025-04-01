import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { IoSend, IoMic, IoMicOff } from 'react-icons/io5';

interface ChatInterfaceProps {
  onSend: (message: string) => void;
  onPreview: (message: string) => void;
  isDark: boolean;
}

const InterfaceContainer = styled.div<{ $isDark: boolean }>`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 320px;
  padding: 20px;
  background: ${props => props.$isDark 
    ? 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)'
    : 'linear-gradient(to top, rgba(255, 255, 255, 0.8), transparent)'};
  z-index: 2;
  
  @media (max-width: 768px) {
    left: 0;
    padding: 10px;
  }
`;

const InputContainer = styled.form`
  display: flex;
  gap: 10px;
  max-width: 800px;
  margin: 0 auto;
`;

const Input = styled.input<{ $isDark: boolean }>`
  flex: 1;
  padding: 12px 20px;
  border-radius: 30px;
  border: none;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  color: inherit;
  font-size: 1rem;
  outline: none;
  transition: background 0.3s ease;
  
  &:focus {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
  }
  
  &::placeholder {
    color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
  }
`;

const Button = styled.button<{ $isDark: boolean; $isRecording?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$isRecording ? '#ff4b4b' : '#4FB6F2'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;
  
  &:hover {
    background: ${props => props.$isRecording ? '#ff3333' : '#3a9bd9'};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    cursor: not-allowed;
    transform: none;
  }
`;

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSend, onPreview, isDark }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsRecording(false);
        // Still preview the transcribed text
        onPreview(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
  }, [onPreview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      onPreview(''); // Clear preview when sending
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    // Only update preview if there's text
    if (newMessage.trim()) {
      onPreview(newMessage);
    } else {
      onPreview(''); // Clear preview if input is empty
    }
  };

  const toggleRecording = () => {
    if (!recognition) return;

    if (!isRecording) {
      recognition.start();
      setIsRecording(true);
    } else {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <InterfaceContainer $isDark={isDark}>
      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleInputChange}
          $isDark={isDark}
        />
        {recognition && (
          <Button 
            type="button"
            onClick={toggleRecording}
            $isDark={isDark}
            $isRecording={isRecording}
          >
            {isRecording ? <IoMicOff size={20} /> : <IoMic size={20} />}
          </Button>
        )}
        <Button type="submit" disabled={!message.trim()} $isDark={isDark}>
          <IoSend size={20} />
        </Button>
      </InputContainer>
    </InterfaceContainer>
  );
};

export default ChatInterface; 