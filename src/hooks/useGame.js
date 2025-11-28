// src/hooks/useGame.js - FIXED VERSION
import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';
import { 
  createNewGame
} from '../lib/gameDatabase';

const useGame = (user) => {
    const [gameState, setGameState] = useState('lobby');
    const [currentGame, setCurrentGame] = useState(null);
    const [userChoice, setUserChoice] = useState(null);
    const [computerChoice, setComputerChoice] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [showChecking, setShowChecking] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(GAME_CONFIG.SOUND.enabled);

    // Start new game
    const startNewGame = useCallback(async () => {
        console.log('🎮 Starting new game');
        
        setGameState('playing');
        setUserChoice(null);
        setComputerChoice(null);
        setGameResult(null);
        setShowChecking(false);
        setCurrentGame(null);
        
        console.log('✅ New game ready for choices');
    }, []);

    // Make choice and SAVE SINGLE GAME TO DATABASE
    const makeChoice = useCallback(async (choice) => {
        console.log(`🎯 User choice: ${choice}`);
        
        // Check if user is properly defined
        if (!user || !user.uid) {
            console.error('❌ No valid user logged in:', user);
            // Still allow gameplay but don't save to database
            setUserChoice(choice);
            setShowChecking(true);
            
            setTimeout(() => {
                const choices = [GAME_CONFIG.CHOICES.DEAD, GAME_CONFIG.CHOICES.ALIVE];
                const computerChoice = choices[Math.floor(Math.random() * choices.length)];
                console.log(`🤖 Computer choice: ${computerChoice}`);
                setComputerChoice(computerChoice);
                setShowChecking(false);

                const result = choice === computerChoice ? GAME_CONFIG.RESULTS.WIN : GAME_CONFIG.RESULTS.LOSE;
                console.log(`🎲 Game result: ${result}`);
                setGameResult(result);
                
                console.log('⚠️ Game not saved - no valid user');
            }, GAME_CONFIG.CHECKING_DELAY);
            return;
        }
        
        setUserChoice(choice);
        setShowChecking(true);

        // Computer makes choice after delay
        setTimeout(async () => {
            const choices = [GAME_CONFIG.CHOICES.DEAD, GAME_CONFIG.CHOICES.ALIVE];
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            console.log(`🤖 Computer choice: ${computerChoice}`);
            setComputerChoice(computerChoice);
            setShowChecking(false);

            // Determine result
            const result = choice === computerChoice ? GAME_CONFIG.RESULTS.WIN : GAME_CONFIG.RESULTS.LOSE;
            console.log(`🎲 Game result: ${result}`);
            setGameResult(result);

            // SAVE SINGLE GAME TO DATABASE
            try {
                console.log('👤 Saving game for user:', user.uid);
                const game = await createNewGame(user.uid, {
                    userChoice: choice,
                    computerChoice: computerChoice,
                    userWon: result === GAME_CONFIG.RESULTS.WIN
                });
                setCurrentGame(game);
                console.log('✅ Game saved to database');
            } catch (error) {
                console.error('❌ Failed to save game data:', error);
            }

        }, GAME_CONFIG.CHECKING_DELAY);
    }, [user]); // Add user to dependencies

    // Reset to lobby
    const resetGame = useCallback(() => {
        console.log('🔄 Resetting to lobby');
        setGameState('lobby');
        setCurrentGame(null);
        setUserChoice(null);
        setComputerChoice(null);
        setGameResult(null);
        setShowChecking(false);
    }, []);

    // Play again - start completely new game
    const playAgain = useCallback(() => {
        console.log('🔄 Playing again');
        startNewGame();
    }, [startNewGame]);

    // Animation selection based on COMPUTER choice
    const getCurrentAnimation = useCallback(() => {
        if (computerChoice === GAME_CONFIG.CHOICES.DEAD) {
            return GAME_CONFIG.ANIMATIONS.MOUSE;
        } else if (computerChoice === GAME_CONFIG.CHOICES.ALIVE) {
            return GAME_CONFIG.ANIMATIONS.BUTTON_PRESS;
        }
        return GAME_CONFIG.ANIMATIONS.MOUSE;
    }, [computerChoice]);

    // Add a simple toggleSound function since useSoundManager is commented out
    const toggleSound = useCallback(() => {
        setSoundEnabled(prev => !prev);
        return !soundEnabled;
    }, [soundEnabled]);

    return {
        gameState,
        userChoice,
        computerChoice,
        gameResult,
        showChecking,
        soundEnabled,
        startNewGame,
        makeChoice,
        resetGame,
        playAgain,
        getCurrentAnimation,
        toggleSound,
        currentGame
    };
};

export default useGame;