import React from 'react';
import Header from './components/Header';
import CatAnimation from './components/CatAnimation';
import UserStatistics from './components/UserStatistics';
import AnimationAttribution from './components/AnimationAttribution';
import { useAuth } from './hooks/useAuth';
import useCatAnimation from './hooks/useCatAnimation';
import useGame from './hooks/useGame';
import './App.css';

export default function App() {
  const { user, loading } = useAuth();
  
  // Use the cat animation hook
  const { 
    RiveComponent, 
    riveLoaded, 
    triggerMouse, 
    triggerButtonPress,
    resetAnimation,
    animationKey,
    isResetting,
    mouseAnimReady,
    buttonAnimReady
  } = useCatAnimation();

  // Use the game hook - pass the user object
  const {
    gameState,
    userChoice,
    computerChoice,
    gameResult,
    showChecking,
    startNewGame,
    makeChoice,
    resetGame,
    playAgain,
    soundEnabled,
    toggleSound
  } = useGame(user); // Make sure user is passed here

  console.log('🔄 App - Cat animation loaded:', riveLoaded);
  console.log('🎮 Game State:', { gameState, userChoice, computerChoice, gameResult, showChecking });
  console.log('👤 User:', user); // Debug user object

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <UserStatistics />
      
      <main className="main-content">
        {user ? (
          <div className="welcome-section">
            {/* Cat Animation Component */}
            <CatAnimation 
              RiveComponent={RiveComponent}
              riveLoaded={riveLoaded}
              triggerMouse={triggerMouse}
              triggerButtonPress={triggerButtonPress}
              resetAnimation={resetAnimation}
              animationKey={animationKey}
              isResetting={isResetting}
              mouseAnimReady={mouseAnimReady}
              buttonAnimReady={buttonAnimReady}
              gameState={gameState}
              userChoice={userChoice}
              computerChoice={computerChoice}
              gameResult={gameResult}
              showChecking={showChecking}
              onStartGame={startNewGame}
              onMakeChoice={makeChoice}
              onPlayAgain={playAgain}
              onResetGame={resetGame}
            />
          </div>
        ) : (
          <div className="landing-section">
            <div className="hero-content">
              <h1>Quantum Cat Game</h1>
              <p>Sign in to play the quantum physics game with Schrödinger's Cat!</p>
              <div className="demo-preview">
                <CatAnimation 
                  RiveComponent={RiveComponent}
                  riveLoaded={riveLoaded}
                  triggerMouse={triggerMouse}
                  triggerButtonPress={triggerButtonPress}
                  resetAnimation={resetAnimation}
                  animationKey={animationKey}
                  isResetting={isResetting}
                  mouseAnimReady={mouseAnimReady}
                  buttonAnimReady={buttonAnimReady}
                  gameState="lobby"
                  onStartGame={() => console.log('Please sign in to play')}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Animation Attribution */}
      <AnimationAttribution />

      {/* Sound Toggle */}
      <div className="sound-toggle">
        <button onClick={toggleSound} className="sound-btn">
          {soundEnabled ? '🔊' : '🔇'} Sound
        </button>
      </div>
    </div>
  );
}