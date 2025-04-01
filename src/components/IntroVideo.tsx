import React, { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import { FaRocket } from 'react-icons/fa';

const VideoOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.5s ease, visibility 0.5s ease;
`;

const Video = styled.video`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  svg {
    font-size: 20px;
  }
`;

const StartButton = styled(Button)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 32px;
  font-size: 24px;
  background: rgba(0, 156, 255, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 20px rgba(0, 156, 255, 0.4);

  &:hover {
    background: rgba(0, 156, 255, 0.8);
    transform: translate(-50%, -52px);
    box-shadow: 0 0 30px rgba(0, 156, 255, 0.6);
  }

  svg {
    font-size: 28px;
  }
`;

const LoadingText = styled.div`
  color: white;
  font-size: 18px;
  margin-top: 20px;
`;

const WelcomeText = styled.div`
  color: white;
  font-size: 32px;
  text-align: center;
  margin-bottom: 30px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(0, 156, 255, 0.6);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s ease forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const VolumeSlider = styled.input`
  width: 100px;
  margin: 0 10px;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
`;

interface IntroVideoProps {
  onComplete: () => void;
  allowSkip?: boolean;
  showOnlyOnce?: boolean;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ 
  onComplete, 
  allowSkip = true,
  showOnlyOnce = true 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [videoEnded, setVideoEnded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Function to play video with sound
  const playVideoWithSound = async () => {
    if (videoRef.current) {
      try {
        // Set initial volume
        videoRef.current.volume = volume;
        // First try to play with sound
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsMuted(false);
      } catch (error) {
        console.log('Autoplay with sound failed, waiting for user interaction');
        // Start muted and wait for user interaction
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          try {
            await videoRef.current.play();
          } catch (mutedError) {
            console.error('Even muted autoplay failed:', mutedError);
            handleSkip();
          }
        }
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    // Check if the intro should be shown
    const hasPlayedIntro = localStorage.getItem('hasPlayedIntro');
    
    if (showOnlyOnce && hasPlayedIntro) {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Add click event listener for first interaction
    const handleFirstInteraction = () => {
      if (!hasInteracted && videoRef.current) {
        setHasInteracted(true);
        // Try to unmute and set volume
        try {
          videoRef.current.muted = false;
          videoRef.current.volume = volume;
          setIsMuted(false);
        } catch (error) {
          console.error('Error unmuting on interaction:', error);
        }
      }
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    // Add event listener for space bar to skip and M key to mute
    const handleKeyPress = (e: KeyboardEvent) => {
      if (allowSkip && e.code === 'Space' && isVisible && !videoEnded) {
        e.preventDefault();
        handleSkip();
      } else if (e.code === 'KeyM' && isVisible) {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'Enter' && videoEnded) {
        e.preventDefault();
        handleStart();
      }
      handleFirstInteraction();
    };

    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onComplete, allowSkip, showOnlyOnce, isVisible, videoEnded, hasInteracted, volume]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    if (videoRef.current) {
      videoRef.current.style.opacity = '0.3';
    }
  };

  const handleStart = () => {
    setIsVisible(false);
    if (showOnlyOnce) {
      localStorage.setItem('hasPlayedIntro', 'true');
    }
    onComplete();
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleVideoEnd();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState) {
        videoRef.current.volume = volume;
      }
    }
  };

  const handleVideoLoaded = async () => {
    setIsLoading(false);
    await playVideoWithSound();
  };

  const handleVideoError = () => {
    console.error('Error loading video');
    handleSkip();
  };

  // Show an unmute prompt if video starts muted
  const UnmutePrompt = styled.div`
    position: absolute;
    top: 20px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 14px;
    animation: fadeInOut 2s ease-in-out infinite;

    @keyframes fadeInOut {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
  `;

  return (
    <VideoOverlay $isVisible={isVisible}>
      {isLoading && <LoadingText>Loading...</LoadingText>}
      {isMuted && !hasInteracted && !isLoading && (
        <UnmutePrompt>
          Click anywhere or press M to unmute
        </UnmutePrompt>
      )}
      <Video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isMuted}
        onEnded={handleVideoEnd}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        src="/intro.mp4"
        style={{ transition: 'opacity 0.5s ease' }}
      />
      {videoEnded && (
        <>
          <WelcomeText>Welcome to Penguin Chat!</WelcomeText>
          <StartButton onClick={handleStart}>
            <FaRocket />
            Start Chatting
          </StartButton>
        </>
      )}
      {!isLoading && (
        <ControlsContainer>
          <Button onClick={toggleMute}>
            {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
            {isMuted ? 'Unmute (M)' : 'Mute (M)'}
          </Button>
          {!isMuted && (
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
            />
          )}
          {allowSkip && !videoEnded && (
            <Button onClick={handleSkip}>
              Skip Intro (Space)
            </Button>
          )}
        </ControlsContainer>
      )}
    </VideoOverlay>
  );
};

export default IntroVideo; 