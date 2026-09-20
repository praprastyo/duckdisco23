import React, { useState, useEffect } from 'react';
import { HomePage } from '../pages/HomePage';
import { LevelSelectPage } from '../pages/LevelSelectPage';
import { GamePage } from '../pages/GamePage';
import { ResultsPage } from '../pages/ResultsPage';
import { DiscoEnvironment } from '../visuals/DiscoEnvironment';
import { AudioEngine } from '../audio/AudioEngine';
import { ScoreSummary } from '../game/ScoringEngine';
import { SaveService, SaveData } from '../services/SaveService';
import { getLevelConfig } from '../config/levels';

type AppView = 'home' | 'levelSelect' | 'game' | 'results';

export const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('level1');
  const [lastSummary, setLastSummary] = useState<ScoreSummary | null>(null);
  const [saveData, setSaveData] = useState<SaveData>(() => SaveService.load());

  useEffect(() => {
    return SaveService.subscribe((data) => setSaveData(data));
  }, []);

  const currentLevelConfig = getLevelConfig(selectedLevelId);
  const intensity = view === 'game' ? (currentLevelConfig?.visualIntensity ?? 0.5) : 0.35;

  const handleEnterClub = () => {
    setView('levelSelect');
  };

  const handleSelectLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
    setView('game');
  };

  const handleFinishLevel = (summary: ScoreSummary) => {
    setLastSummary(summary);
    setView('results');
  };

  const handleRetryLevel = () => {
    setView('game');
  };

  const handleBackToSelect = () => {
    setView('levelSelect');
  };

  const handleBackToHome = () => {
    setView('home');
  };

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden select-none transition-colors duration-500 ${
      view === 'game' && selectedLevelId === 'level1' ? 'bg-[#5ec5f8]' : 'bg-[#07040e] text-white'
    }`}>
      {/* Background music-reactive canvas (Disabled for sunny beach Level 1) */}
      {!(view === 'game' && selectedLevelId === 'level1') && (
        <DiscoEnvironment
          analyser={AudioEngine.getInstance().getAnalyser()}
          intensity={intensity}
          reducedMotion={saveData.settings.reducedMotion}
        />
      )}

      {/* Main Page Routing */}
      {view === 'home' && <HomePage onEnterClub={handleEnterClub} />}

      {view === 'levelSelect' && (
        <LevelSelectPage
          onSelectLevel={handleSelectLevel}
          onBackHome={handleBackToHome}
        />
      )}

      {view === 'game' && (
        <GamePage
          levelId={selectedLevelId}
          onFinish={handleFinishLevel}
          onExit={handleBackToSelect}
        />
      )}

      {view === 'results' && lastSummary && (
        <ResultsPage
          levelId={selectedLevelId}
          summary={lastSummary}
          onRetry={handleRetryLevel}
          onContinue={handleBackToSelect}
        />
      )}
    </div>
  );
};
