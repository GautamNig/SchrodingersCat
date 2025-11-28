import React, { useEffect, useState, useCallback } from 'react';
import './CatAnimation.css';
import ChoicePopup from './ChoicePopup';
import CheckingTooltip from './CheckingTooltip';
import SimpleResult from './SimpleResult';

export default function CatAnimation({ 
  RiveComponent, 
  riveLoaded, 
  triggerMouse, 
  triggerButtonPress,
  resetAnimation,
  animationKey,
  isResetting,
  mouseAnimReady,
  buttonAnimReady,
  gameState = 'lobby',
  userChoice,
  computerChoice,
  gameResult,
  showChecking,
  onStartGame,
  onMakeChoice,
  onPlayAgain,
  onResetGame
}) {
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [lastComputerChoice, setLastComputerChoice] = useState(null);

  console.log('🐱 CatAnimation - Game State:', { 
    gameState, 
    userChoice, 
    computerChoice, 
    gameResult, 
    showChecking,
    animationCompleted,
    mouseAnimReady,
    buttonAnimReady
  });

  // Reset animation when starting new game
  useEffect(() => {
    if (gameState === 'playing' && !userChoice && !computerChoice) {
      console.log('🎮 New game started - resetting Rive animation');
      resetAnimation();
      setAnimationCompleted(false);
      setLastComputerChoice(null);
    }
  }, [gameState, userChoice, computerChoice, resetAnimation]);

  // Reset animation when returning to lobby
  useEffect(() => {
    if (gameState === 'lobby') {
      console.log('🏠 Returning to lobby - resetting Rive animation');
      resetAnimation();
      setAnimationCompleted(false);
      setLastComputerChoice(null);
    }
  }, [gameState, resetAnimation]);

  // Track computer choice changes
  useEffect(() => {
    if (computerChoice && computerChoice !== lastComputerChoice) {
      console.log('🤖 Computer choice updated:', computerChoice);
      setLastComputerChoice(computerChoice);
    }
  }, [computerChoice, lastComputerChoice]);

  // Trigger animation when computerChoice is available and ready
  useEffect(() => {
    if (!computerChoice || showChecking || animationCompleted || isResetting) {
      return;
    }

    if (!riveLoaded) {
      console.log('⏳ Waiting for rive to finish loading...');
      return;
    }

    const requiresMouseAnim = computerChoice === 'dead';
    const requiredReady = requiresMouseAnim ? mouseAnimReady : buttonAnimReady;

    if (!requiredReady) {
      console.log(`⏳ Required Rive input for "${computerChoice}" not ready yet`);
      return;
    }

    console.log(`🚀 Triggering ${computerChoice} animation now`);
    let ok = false;
    if (requiresMouseAnim) {
      ok = triggerMouse();
    } else {
      ok = triggerButtonPress();
    }

    if (!ok) {
      console.warn('❌ Animation trigger failed');
      return;
    }

    console.log(`⏱️ Animation started — waiting 9000ms for completion`);
    const timeoutId = setTimeout(() => {
      console.log('✅ Animation completed, showing result');
      setAnimationCompleted(true);
    }, 9000); // 9 seconds for animation completion

    return () => clearTimeout(timeoutId);

  }, [
    computerChoice,
    showChecking,
    animationCompleted,
    isResetting,
    riveLoaded,
    mouseAnimReady,
    buttonAnimReady,
    triggerMouse,
    triggerButtonPress
  ]);

  // Handle Play Again
  const handlePlayAgain = useCallback(() => {
    console.log('🔄 Play Again clicked - resetting everything');
    setAnimationCompleted(false);
    setLastComputerChoice(null);
    onPlayAgain();
  }, [onPlayAgain]);

  // Handle Back to Lobby
  const handleBackToLobby = useCallback(() => {
    console.log('🏠 Back to Lobby clicked - resetting everything');
    setAnimationCompleted(false);
    setLastComputerChoice(null);
    onResetGame();
  }, [onResetGame]);

  return (
    <div className="cat-animation-container">
      {/* Cat Animation */}
      <div className="rive-container" key={animationKey}>
        <RiveComponent 
          className="cat-animation"
        />
        
        {(!riveLoaded || isResetting) && (
          <div className="animation-loading">
            {isResetting ? '🔄 Resetting Animation...' : '🐱 Loading Animation...'}
          </div>
        )}
      </div>

      {/* Game UI Components */}
      {gameState === 'lobby' && (
        <div className="game-controls">
          <button 
            onClick={onStartGame}
            className="start-game-btn"
          >
            🎮 Start Quantum Game
          </button>
        </div>
      )}

      {gameState === 'playing' && !userChoice && !showChecking && !computerChoice && (
        <ChoicePopup onMakeChoice={onMakeChoice} onClose={handleBackToLobby} />
      )}

      {showChecking && <CheckingTooltip />}

      {gameResult && computerChoice && animationCompleted && (
        <SimpleResult
          userChoice={userChoice}
          computerChoice={computerChoice}
          gameResult={gameResult}
          onPlayAgain={handlePlayAgain}
          onClose={handleBackToLobby}
        />
      )}
    </div>
  );
}