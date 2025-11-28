// src/components/SimpleResult.jsx
import React from 'react';
import { GAME_CONFIG } from '../config/gameConfig';

const SimpleResult = ({ 
    userChoice, 
    computerChoice, 
    gameResult, 
    onPlayAgain,
    onClose 
}) => {
    const userWon = gameResult === GAME_CONFIG.RESULTS.WIN;
    
    const getChoiceEmoji = (choice) => {
        return choice === GAME_CONFIG.CHOICES.DEAD ? '💀' : '😸';
    };

    const getChoiceText = (choice) => {
        return choice === GAME_CONFIG.CHOICES.DEAD ? 'Dead' : 'Alive';
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
        }}>
            <div style={{
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                border: userWon 
                    ? '1px solid rgba(107, 207, 127, 0.4)' 
                    : '1px solid rgba(255, 107, 107, 0.4)',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                maxWidth: '350px',
                width: '90%',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            }}>
                {/* Result Icon */}
                <div style={{
                    fontSize: '40px',
                    marginBottom: '15px'
                }}>
                    {userWon ? '🎉' : '💫'}
                </div>

                {/* Result Title */}
                <h2 style={{
                    color: userWon ? '#6bcf7f' : '#FF6B6B',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '0 0 15px 0'
                }}>
                    {userWon ? 'You Win!' : 'You Lose!'}
                </h2>

                {/* Choices Comparison */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    {/* User Choice */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>
                            {getChoiceEmoji(userChoice)}
                        </div>
                        <div style={{
                            color: '#FFD93D',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '3px'
                        }}>
                            You
                        </div>
                        <div style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            {getChoiceText(userChoice)}
                        </div>
                    </div>

                    {/* VS Separator */}
                    <div style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        padding: '0 10px'
                    }}>
                        VS
                    </div>

                    {/* Computer Choice */}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>
                            {getChoiceEmoji(computerChoice)}
                        </div>
                        <div style={{
                            color: '#FFD93D',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '3px'
                        }}>
                            Computer
                        </div>
                        <div style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            {getChoiceText(computerChoice)}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onPlayAgain}
                        style={{
                            background: 'linear-gradient(135deg, #8a7fff, #6366f1)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '12px 20px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            flex: 2
                        }}
                    >
                        Play Again
                    </button>
                    
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            padding: '12px 15px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimpleResult;