import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSettingsSharp, IoClose, IoMoon, IoSunny, IoVolumeMedium, IoVolumeOff } from 'react-icons/io5';
import { MdSpeed } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';

interface SettingsProps {
  onThemeChange: (isDark: boolean) => void;
  onSoundToggle: (isOn: boolean) => void;
  onSpeedChange: (speed: number) => void;
  onVoiceSettingsChange: (settings: VoiceSettings) => void;
  isDarkMode: boolean;
  isSoundOn: boolean;
  speed: number;
  voiceSettings: VoiceSettings;
}

interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceName?: string;
}

const VoiceSelect = styled.select<{ $isDark: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  color: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  
  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  }
  
  &:focus {
    border-color: #4FB6F2;
  }
  
  option {
    background: ${props => props.$isDark ? '#1a1a1a' : '#ffffff'};
  }
`;

const Settings: React.FC<SettingsProps> = ({
  onThemeChange,
  onSoundToggle,
  onSpeedChange,
  onVoiceSettingsChange,
  isDarkMode,
  isSoundOn,
  speed,
  voiceSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Also listen for the voiceschanged event
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const handleThemeToggle = () => {
    onThemeChange(!isDarkMode);
  };
  
  const handleSoundToggle = () => {
    onSoundToggle(!isSoundOn);
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    onSpeedChange(newSpeed);
  };

  const handleVoiceSettingChange = (setting: keyof VoiceSettings, value: number | string) => {
    onVoiceSettingsChange({
      ...voiceSettings,
      [setting]: value
    });
  };

  const testVoice = () => {
    const utterance = new SpeechSynthesisUtterance("Hi! I'm Frosty, your penguin friend!");
    utterance.pitch = voiceSettings.pitch;
    utterance.rate = voiceSettings.rate;
    utterance.volume = voiceSettings.volume;
    
    if (voiceSettings.voiceName) {
      const selectedVoice = availableVoices.find(voice => voice.name === voiceSettings.voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <SettingsButton
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        $isDark={isDarkMode}
      >
        <IoSettingsSharp size={24} />
      </SettingsButton>
      
      <AnimatePresence>
        {isOpen && (
          <SettingsPanel
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            $isDark={isDarkMode}
          >
            <SettingsHeader>
              <h3>Settings</h3>
              <CloseButton onClick={() => setIsOpen(false)} $isDark={isDarkMode}>
                <IoClose size={24} />
              </CloseButton>
            </SettingsHeader>
            
            <SettingItem $isDark={isDarkMode}>
              <SettingLabel $isDark={isDarkMode}>
                {isDarkMode ? <IoMoon /> : <IoSunny />}
                <span>Dark Mode</span>
              </SettingLabel>
              <Toggle $active={isDarkMode} $isDark={isDarkMode} onClick={handleThemeToggle} />
            </SettingItem>
            
            <SettingItem $isDark={isDarkMode}>
              <SettingLabel $isDark={isDarkMode}>
                {isSoundOn ? <IoVolumeMedium /> : <IoVolumeOff />}
                <span>Sound Effects</span>
              </SettingLabel>
              <Toggle $active={isSoundOn} $isDark={isDarkMode} onClick={handleSoundToggle} />
            </SettingItem>
            
            <SettingItem $isDark={isDarkMode}>
              <SettingLabel $isDark={isDarkMode}>
                <MdSpeed />
                <span>Animation Speed</span>
              </SettingLabel>
              <Slider
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speed}
                onChange={handleSpeedChange}
                $isDark={isDarkMode}
              />
            </SettingItem>

            {isSoundOn && (
              <VoiceSettingsContainer $isDark={isDarkMode}>
                <VoiceSettingItem $isDark={isDarkMode}>
                  <SettingLabel $isDark={isDarkMode}>
                    <FaMicrophone />
                    <span>Voice Settings</span>
                  </SettingLabel>

                  <SliderContainer>
                    <span>Voice:</span>
                    <VoiceSelect
                      value={voiceSettings.voiceName || ''}
                      onChange={(e) => handleVoiceSettingChange('voiceName', e.target.value)}
                      $isDark={isDarkMode}
                    >
                      <option value="">Default Voice</option>
                      {availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))}
                    </VoiceSelect>
                  </SliderContainer>
                  
                  <SliderContainer>
                    <span>Pitch:</span>
                    <Slider
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSettings.pitch}
                      onChange={(e) => handleVoiceSettingChange('pitch', parseFloat(e.target.value))}
                      $isDark={isDarkMode}
                    />
                    <SliderValue $isDark={isDarkMode}>{voiceSettings.pitch.toFixed(1)}</SliderValue>
                  </SliderContainer>

                  <SliderContainer>
                    <span>Rate:</span>
                    <Slider
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSettings.rate}
                      onChange={(e) => handleVoiceSettingChange('rate', parseFloat(e.target.value))}
                      $isDark={isDarkMode}
                    />
                    <SliderValue $isDark={isDarkMode}>{voiceSettings.rate.toFixed(1)}</SliderValue>
                  </SliderContainer>

                  <SliderContainer>
                    <span>Volume:</span>
                    <Slider
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={voiceSettings.volume}
                      onChange={(e) => handleVoiceSettingChange('volume', parseFloat(e.target.value))}
                      $isDark={isDarkMode}
                    />
                    <SliderValue $isDark={isDarkMode}>{(voiceSettings.volume * 100).toFixed(0)}%</SliderValue>
                  </SliderContainer>

                  <TestButton onClick={testVoice} $isDark={isDarkMode} disabled={!isSoundOn}>
                    <FaMicrophone size={14} />
                    Test Voice
                  </TestButton>
                </VoiceSettingItem>
              </VoiceSettingsContainer>
            )}
          </SettingsPanel>
        )}
      </AnimatePresence>
    </>
  );
};

const SettingsButton = styled(motion.button)<{ $isDark: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.1)'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isDark ? '#fff' : '#333'};
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.2)'};
  }
`;

const SettingsPanel = styled(motion.div)<{ $isDark: boolean }>`
  position: fixed;
  top: 70px;
  right: 20px;
  width: 280px;
  background: ${props => props.$isDark 
    ? 'rgba(15, 15, 15, 0.95)'
    : 'rgba(255, 255, 255, 0.95)'};
  border-radius: 12px;
  padding: 20px;
  color: ${props => props.$isDark ? '#fff' : '#333'};
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: ${props => props.$isDark 
    ? '0 4px 6px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
    : '0 4px 6px rgba(0, 0, 0, 0.1)'};
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    background: linear-gradient(135deg, #4FB6F2, #A5D8FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CloseButton = styled.button<{ $isDark: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.$isDark ? '#fff' : '#000'};
  }
`;

const SettingItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 0;
  border-bottom: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(0, 0, 0, 0.05)'};
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'};
  
  svg {
    font-size: 1.2rem;
    color: #4FB6F2;
  }
`;

const Toggle = styled.button<{ $active: boolean; $isDark: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.$active 
    ? '#4FB6F2' 
    : props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
  position: relative;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${props => props.$active ? '26px' : '2px'};
    transition: left 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const Slider = styled.input<{ $isDark: boolean }>`
  width: 100px;
  -webkit-appearance: none;
  height: 4px;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #4FB6F2;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const VoiceSettingsContainer = styled.div<{ $isDark: boolean }>`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const VoiceSettingItem = styled(SettingItem)`
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
`;

const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SliderValue = styled.span<{ $isDark: boolean }>`
  min-width: 40px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const TestButton = styled.button<{ $isDark: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: #4FB6F2;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;

  &:hover {
    background: #3a9bd9;
  }

  &:disabled {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    cursor: not-allowed;
  }
`;

export default Settings; 