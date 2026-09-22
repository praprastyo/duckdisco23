import React, { useState, useEffect } from 'react';
import { Level4Scene, DuckNpcId, GameProgress } from './types/level4Types';
import { SaveService } from '../services/SaveService';
import { AudioManager } from './audio/AudioManager';
import { BallroomEntrance } from './ballroom/BallroomEntrance';
import { BallroomHub } from './ballroom/BallroomHub';
import { TypingBattle } from './typing/TypingBattle';
import { PuzzleGame } from './puzzle/PuzzleGame';
import { ShooterGame } from './shooter/ShooterGame';
import { GiftReveal3D } from './reveal/GiftReveal3D';
import { LetterReveal } from './reveal/LetterReveal';
import { Level4DebugMenu } from './debug/Level4DebugMenu';

interface Level4Props {
  onExit: () => void;
}

export const Level4: React.FC<Level4Props> = ({ onExit }) => {
  const [scene, setScene] = useState<Level4Scene>('splash');
  const [saveData, setSaveData] = useState(() => SaveService.getLevel4Data());
  const audio = AudioManager.getInstance();

  useEffect(() => {
    return SaveService.subscribe((data) => {
      if (data.level4Data) setSaveData(data.level4Data);
    });
  }, []);

  const progress: GameProgress = {
    typingCompleted: saveData.typingCompleted,
    puzzleCompleted: saveData.puzzleCompleted,
    shooterCompleted: saveData.shooterCompleted,
  };

  const isGiftUnlocked =
    progress.typingCompleted && progress.puzzleCompleted && progress.shooterCompleted;

  const navigateTo = (targetScene: Level4Scene) => {
    setScene(targetScene);
    if (targetScene === 'ballroom') {
      audio.setBallroomFocus('hub');
    } else if (['typing', 'puzzle', 'shooter'].includes(targetScene)) {
      audio.setBallroomFocus('minigame');
    } else if (targetScene === 'giftReveal') {
      audio.setBallroomFocus('reveal');
    }
  };

  const handleEnterBallroom = () => {
    audio.startBallroomMusic();
    navigateTo('ballroom');
  };

  const handleSelectGame = (gameId: DuckNpcId) => {
    if (gameId === 'typing') navigateTo('typing');
    else if (gameId === 'puzzle') navigateTo('puzzle');
    else if (gameId === 'cowboy') navigateTo('shooter');
  };

  const handleGameWin = (game: 'typing' | 'puzzle' | 'shooter') => {
    const key = `${game}Completed` as keyof GameProgress;
    SaveService.saveLevel4Progress({ [key]: true });
    navigateTo('ballroom');
  };

  const handleOpenGiftFromHub = () => {
    if (isGiftUnlocked) {
      navigateTo('giftReveal');
    }
  };

  const handleOpenLetter = () => {
    SaveService.saveLevel4Progress({ finalGiftOpened: true });
    navigateTo('letter');
  };

  const handleExitExperience = () => {
    audio.stopBallroomMusic();
    onExit();
  };

  const handleDebugSetProgress = (partial: Partial<GameProgress>) => {
    SaveService.saveLevel4Progress(partial);
  };

  const handleDebugReset = () => {
    SaveService.resetLevel4Progress();
    navigateTo('ballroom');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#070312] text-white select-none">
      {scene === 'splash' && (
        <BallroomEntrance onEnter={handleEnterBallroom} onExit={handleExitExperience} />
      )}

      {scene === 'ballroom' && (
        <BallroomHub
          progress={progress}
          isUnlocked={isGiftUnlocked}
          onSelectGame={handleSelectGame}
          onOpenGift={handleOpenGiftFromHub}
          onExit={handleExitExperience}
        />
      )}

      {scene === 'typing' && (
        <TypingBattle
          onWin={() => handleGameWin('typing')}
          onExit={() => navigateTo('ballroom')}
        />
      )}

      {scene === 'puzzle' && (
        <PuzzleGame
          onWin={() => handleGameWin('puzzle')}
          onExit={() => navigateTo('ballroom')}
        />
      )}

      {scene === 'shooter' && (
        <ShooterGame
          onWin={() => handleGameWin('shooter')}
          onExit={() => navigateTo('ballroom')}
        />
      )}

      {scene === 'giftReveal' && (
        <GiftReveal3D
          onOpenLetter={handleOpenLetter}
          onExit={() => navigateTo('ballroom')}
        />
      )}

      {scene === 'letter' && (
        <LetterReveal onBackToBallroom={() => navigateTo('ballroom')} />
      )}

      {/* DevMode Drawer */}
      <Level4DebugMenu
        progress={progress}
        isGiftUnlocked={isGiftUnlocked}
        currentScene={scene}
        onSetProgress={handleDebugSetProgress}
        onNavigateScene={navigateTo}
        onReset={handleDebugReset}
      />
    </div>
  );
};
