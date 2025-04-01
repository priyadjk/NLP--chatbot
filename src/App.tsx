import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ChatHistory from './components/ChatHistory';
import ChatInterface from './components/ChatInterface';
import Penguin from './components/Penguin';
import Settings from './components/Settings';
import IntroVideo from './components/IntroVideo';

const AppContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark 
    ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
    : 'linear-gradient(135deg, #e0e0e0 0%, #b3d4fc 100%)'};
  color: ${props => props.$isDark ? '#fff' : '#333'};
  transition: background 0.3s ease, color 0.3s ease;
`;

const MainContent = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
`;

const Sidebar = styled.div<{ $isDark: boolean }>`
  width: 320px;
  height: 100%;
  background: ${props => props.$isDark 
    ? 'rgba(20, 20, 20, 0.8)'
    : 'rgba(255, 255, 255, 0.6)'};
  backdrop-filter: blur(10px);
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  z-index: 1;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 4px;
  }
`;

const Header = styled.div<{ $isDark: boolean }>`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  background: linear-gradient(135deg, #4FB6F2, #A5D8FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  margin: 5px 0 0;
  opacity: 0.7;
  font-size: 0.9rem;
`;

const PenguinWrapper = styled.div<{ $speed: number }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  
  * {
    transition-duration: ${props => `${1 / props.$speed}s`} !important;
  }
`;

const jokeIntros = [
  "Here's one of my favorite ice-breakers!",
  "This one always makes my flippers flap with laughter!",
  "Here's a cool joke that never gets cold!",
  "Waddle you think of this one?",
  "This joke is snow funny!"
];

const jokeTransitions = [
  "*giggles in penguin*",
  "*waddles excitedly*",
  "*flaps flippers*",
  "*does a happy dance*",
  "*slides on belly*"
];

const greetings = [
  "Hi there! I'm Frosty, your friendly penguin assistant. I can chat with you, tell jokes, and keep you company!",
  "Hello friend! I'm Frosty, and I love making new friends. How can I brighten your day?",
  "Waddle waddle! I'm Frosty, and I'm here to chat and share some laughs!",
  "Hey there! I'm Frosty, a happy little penguin who loves making new friends!",
  "Greetings! I'm Frosty, your penguin pal. I'm snow excited to meet you!"
];

const questionResponses = [
  "That's an interesting question! While I'm mainly designed for jokes and friendly chat, I'd love to share a fun joke with you instead!",
  "Hmm, let me think... *taps beak* You know what would be more fun? A hilarious joke!",
  "While I'm not sure about that, I do know some amazing jokes that'll make you smile!",
  "That's a cool question! Speaking of cool things, would you like to hear a funny joke?",
  "I might need to waddle through that question... But I definitely know some great jokes!"
];

const generalResponses = [
  "As a friendly penguin, I specialize in telling jokes and spreading joy! Would you like to hear a funny one?",
  "Waddle you say to hearing one of my ice-cool jokes?",
  "I may be a penguin, but my jokes are anything but cold! Want to hear one?",
  "I love sharing laughs with friends! How about a joke to brighten your day?",
  "You know what would be fun right now? A hilarious joke! Just say 'tell me a joke' and I'll share one!"
];

const jokes = [
  { question: "What is the most popular fish in the ocean?", answer: "The starfish!" },
  { question: "Why don't eggs tell a joke?", answer: "They would crack each other up!" },
  { question: "What do you call a magic dog?", answer: "A labracadabrador!" },
  { question: "What is an astronaut's favorite part on a computer?", answer: "The space bar!" },
  { question: "What do cows do on date night?", answer: "Go to the moo-vies!" }
];

interface Message {
  text: string;
  isUser: boolean;
}

interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceName?: string;
}

// Add voice style configurations
const voiceStyles = {
  normal: {
    pitch: 1.3,  // Slightly higher pitch for cute penguin voice
    rate: 0.9,   // Slightly slower for clarity
  },
  excited: {
    pitch: 1.5,  // Higher pitch for excitement
    rate: 1.1,   // Faster for enthusiasm
  },
  playful: {
    pitch: 1.4,  // Moderately high for playfulness
    rate: 1.0,   // Normal speed
  },
  thoughtful: {
    pitch: 1.2,  // Lower pitch for thinking
    rate: 0.85,  // Slower for emphasis
  }
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === null ? true : savedTheme === 'dark';
  });
  const [showContent, setShowContent] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(() => {
    const savedSound = localStorage.getItem('sound');
    return savedSound === null ? true : savedSound === 'on';
  });
  const [animationSpeed, setAnimationSpeed] = useState(() => {
    const savedSpeed = localStorage.getItem('speed');
    return savedSpeed ? parseFloat(savedSpeed) : 1;
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const savedVoiceSettings = localStorage.getItem('voiceSettings');
    return savedVoiceSettings ? JSON.parse(savedVoiceSettings) : {
      pitch: 1.2,
      rate: 1.0,
      volume: 0.8,
      voiceName: ''
    };
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewText, setPreviewText] = useState<string | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [usedJokeIndices, setUsedJokeIndices] = useState<number[]>([]);

  useEffect(() => {
    if (window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const speak = async (text: string, style: 'normal' | 'excited' | 'playful' | 'thoughtful' = 'normal') => {
    return new Promise<void>((resolve) => {
      if (!isSoundOn || !speechSynthesis) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get available voices
      let voices = speechSynthesis.getVoices();
      
      // If voices array is empty, wait for voices to load
      if (voices.length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
          voices = speechSynthesis.getVoices();
          // Try to find an English voice
          const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en') && !voice.name.includes('Microsoft')
          );
          if (englishVoice) utterance.voice = englishVoice;
        }, { once: true });
      } else {
        // Try to find an English voice
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en') && !voice.name.includes('Microsoft')
        );
        if (englishVoice) utterance.voice = englishVoice;
      }

      // Set voice characteristics based on style
      switch (style) {
        case 'excited':
          utterance.pitch = 1.3;
          utterance.rate = 1.1;
          break;
        case 'playful':
          utterance.pitch = 1.2;
          utterance.rate = 1.0;
          break;
        case 'thoughtful':
          utterance.pitch = 1.0;
          utterance.rate = 0.9;
          break;
        default:
          utterance.pitch = 1.1;
          utterance.rate = 1.0;
      }

      // Set volume based on system settings
      utterance.volume = 1.0;

      // Add event listeners
      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        resolve();
      };

      // Speak the text
      speechSynthesis.speak(utterance);
    });
  };

  const handlePreview = (message: string) => {
    // Only update the preview text without speaking
    setPreviewText(message);
  };

  const getNewJoke = () => {
    let availableIndices = jokes.map((_, index) => index)
      .filter(index => !usedJokeIndices.includes(index));
    
    // If all jokes have been used, reset the used jokes tracking
    if (availableIndices.length === 0) {
      setUsedJokeIndices([]);
      availableIndices = jokes.map((_, index) => index);
    }
    
    // Pick a random joke from available ones
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    
    // Add this joke to used jokes
    setUsedJokeIndices(prev => [...prev, randomIndex]);
    
    return jokes[randomIndex];
  };

  const handleSend = async (message: string) => {
    setPreviewText(null);
    speechSynthesis?.cancel();
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
      const randomJoke = getNewJoke();
      const intro = jokeIntros[Math.floor(Math.random() * jokeIntros.length)];
      const transition = jokeTransitions[Math.floor(Math.random() * jokeTransitions.length)];
      
      // Send and speak the intro with excited voice
      setMessages(prev => [...prev, { 
        text: intro,
        isUser: false 
      }]);
      await speak(intro, 'excited');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Send and speak the question with playful voice
      setMessages(prev => [...prev, { 
        text: randomJoke.question,
        isUser: false 
      }]);
      await speak(randomJoke.question, 'playful');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, { 
        text: transition,
        isUser: false 
      }]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Finally, send and speak the answer with excited voice
      setMessages(prev => [...prev, { 
        text: randomJoke.answer,
        isUser: false 
      }]);
      await speak(randomJoke.answer, 'excited');

      if (usedJokeIndices.length === jokes.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const cycleMessage = "That was my last joke! But don't worry, I can start over with fresh ones. Just ask for another!";
        setMessages(prev => [...prev, { 
          text: cycleMessage,
          isUser: false 
        }]);
        await speak(cycleMessage, 'playful');
      }
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      const response = greetings[Math.floor(Math.random() * greetings.length)];
      setMessages(prev => [...prev, { 
        text: response,
        isUser: false 
      }]);
      await speak(response, 'excited');
    } else if (lowerMessage.includes('?')) {
      const response = questionResponses[Math.floor(Math.random() * questionResponses.length)];
      setMessages(prev => [...prev, { 
        text: response,
        isUser: false 
      }]);
      await speak(response, 'thoughtful');
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      const response = "You're welcome! I love making friends smile. Would you like to hear another joke?";
      setMessages(prev => [...prev, { 
        text: response,
        isUser: false 
      }]);
      await speak(response, 'playful');
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      const response = "Waddle I do without you? Come back soon for more jokes and penguin fun!";
      setMessages(prev => [...prev, { 
        text: response,
        isUser: false 
      }]);
      await speak(response, 'playful');
    } else {
      const response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      setMessages(prev => [...prev, { 
        text: response,
        isUser: false 
      }]);
      await speak(response, 'normal');
    }
  };

  const handleThemeChange = (isDark: boolean) => {
    setIsDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const handleSoundToggle = (isOn: boolean) => {
    setIsSoundOn(isOn);
    localStorage.setItem('sound', isOn ? 'on' : 'off');
    
    if (!isOn) {
      // Cancel any ongoing speech when sound is turned off
      speechSynthesis?.cancel();
    } else {
      // Test sound when turned on
      speak("Sound enabled!", "excited");
    }
  };

  const handleSpeedChange = (speed: number) => {
    setAnimationSpeed(speed);
    localStorage.setItem('speed', speed.toString());
  };

  const handleVoiceSettingsChange = (settings: VoiceSettings) => {
    setVoiceSettings(settings);
    localStorage.setItem('voiceSettings', JSON.stringify(settings));
  };

  // Add initial greeting after intro
  const playInitialGreeting = async () => {
    const greetings = [
      "Hi there! I'm Frosty, your penguin AI companion. *waddles excitedly* I'm snow excited to meet you!",
      "Welcome to my cozy corner of the internet! *adjusts bow tie* Ready for some cool conversations?",
      "*slides in on belly* Hey friend! I'm Frosty, and I'm here to make your day a little more chill!"
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    setMessages([{ text: greeting, isUser: false }]);
    if (isSoundOn && speechSynthesis) {
      await speak(greeting, 'excited');
    }
  };

  const handleIntroComplete = () => {
    setShowContent(true);
    playInitialGreeting();
  };

  return (
    <>
      <IntroVideo 
        onComplete={handleIntroComplete}
        allowSkip={true}
        showOnlyOnce={false}
      />
      <AppContainer 
        $isDark={isDarkMode} 
        style={{ 
          opacity: showContent ? 1 : 0, 
          transition: 'opacity 0.8s ease',
          visibility: showContent ? 'visible' : 'hidden'
        }}
      >
        <Settings
          onThemeChange={handleThemeChange}
          onSoundToggle={handleSoundToggle}
          onSpeedChange={handleSpeedChange}
          onVoiceSettingsChange={handleVoiceSettingsChange}
          isDarkMode={isDarkMode}
          isSoundOn={isSoundOn}
          speed={animationSpeed}
          voiceSettings={voiceSettings}
        />
        <MainContent>
          <Sidebar $isDark={isDarkMode}>
            <Header $isDark={isDarkMode}>
              <Title>Chat with Frosty</Title>
              <Subtitle>Your Penguin AI Companion</Subtitle>
            </Header>
            <ChatHistory messages={messages} isDark={isDarkMode} />
          </Sidebar>
          <PenguinWrapper $speed={animationSpeed}>
            <Penguin isSpeaking={Boolean(previewText) || (messages.length > 0 && !messages[messages.length - 1].isUser)} />
          </PenguinWrapper>
          <ChatInterface onSend={handleSend} onPreview={handlePreview} isDark={isDarkMode} />
        </MainContent>
      </AppContainer>
    </>
  );
}

export default App; 