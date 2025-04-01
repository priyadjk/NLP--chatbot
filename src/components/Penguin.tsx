import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface PenguinProps {
  isSpeaking: boolean;
}

const CircleBackground = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(44, 62, 80, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid #0A84FF;
    box-shadow: 0 0 20px #0A84FF;
    opacity: 0.5;
  }
`;

const SpeakingWave = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #0A84FF;
  opacity: 0.5;
`;

const PenguinContainer = styled(motion.div)`
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PenguinBody = styled.div`
  position: relative;
  width: 120px;
  height: 140px;
  background: #2C3E50;
  border-radius: 60px 60px 50px 50px;
  overflow: visible;
`;

const PenguinBelly = styled.div`
  position: absolute;
  width: 80px;
  height: 100px;
  background: white;
  border-radius: 40px 40px 30px 30px;
  top: 30px;
  left: 20px;
`;

const Eye = styled(motion.div)`
  position: absolute;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  top: 30px;

  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #0A84FF;
    border-radius: 50%;
    top: 6px;
    left: 6px;
  }

  &.left {
    left: 25px;
  }

  &.right {
    right: 25px;
  }
`;

const Beak = styled(motion.div)`
  position: absolute;
  width: 24px;
  height: 16px;
  background: #FF9F43;
  border-radius: 12px 12px 6px 6px;
  top: 50px;
  left: 48px;
`;

const Wing = styled(motion.div)`
  position: absolute;
  width: 30px;
  height: 60px;
  background: #2C3E50;
  border-radius: 30px;

  &.left {
    left: -10px;
    top: 40px;
    transform-origin: top center;
  }

  &.right {
    right: -10px;
    top: 40px;
    transform-origin: top center;
  }
`;

const Foot = styled(motion.div)`
  position: absolute;
  width: 24px;
  height: 12px;
  background: #FF9F43;
  border-radius: 12px 12px 0 0;
  bottom: -8px;

  &.left {
    left: 30px;
  }

  &.right {
    right: 30px;
  }
`;

const Cheek = styled.div`
  position: absolute;
  width: 12px;
  height: 8px;
  background: #FF9F43;
  border-radius: 50%;
  opacity: 0.5;
  top: 50px;

  &.left {
    left: 15px;
  }

  &.right {
    right: 15px;
  }
`;

const Penguin: React.FC<PenguinProps> = ({ isSpeaking }) => {
  return (
    <CircleBackground
      animate={{
        scale: isSpeaking ? [1, 1.05, 1] : 1,
        boxShadow: isSpeaking ? '0 0 30px #0A84FF' : '0 0 0px #0A84FF',
      }}
      transition={{
        duration: 1,
        repeat: isSpeaking ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {isSpeaking && [...Array(3)].map((_, i) => (
        <SpeakingWave
          key={i}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear"
          }}
        />
      ))}
      <PenguinContainer
        animate={{
          y: [-3, 2, -3],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <PenguinBody>
          <PenguinBelly />
          <Eye className="left" />
          <Eye className="right" />
          <Beak
            animate={isSpeaking ? {
              scaleY: [1, 0.7, 1],
            } : {}}
            transition={{
              duration: 0.3,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          <Wing
            className="left"
            animate={isSpeaking ? {
              rotate: [-20, 0, -20],
            } : {
              rotate: [-10, 0, -10],
            }}
            transition={{
              duration: isSpeaking ? 0.6 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Wing
            className="right"
            animate={isSpeaking ? {
              rotate: [20, 0, 20],
            } : {
              rotate: [10, 0, 10],
            }}
            transition={{
              duration: isSpeaking ? 0.6 : 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Foot className="left" />
          <Foot className="right" />
          <Cheek className="left" />
          <Cheek className="right" />
        </PenguinBody>
      </PenguinContainer>
    </CircleBackground>
  );
};

export default Penguin; 