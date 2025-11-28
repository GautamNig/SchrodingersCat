// src/components/ChoicePopup.jsx
import React from 'react';
import { GAME_CONFIG} from '../config/gameConfig';

const ChoicePopup = ({ onMakeChoice, currentRound, onClose }) => {
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
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                position: 'relative'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(255, 107, 107, 0.2)',
                        color: '#ff6b6b',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>

                {/* Round Info */}
                <div style={{
                    background: 'rgba(255, 217, 61, 0.1)',
                    border: '1px solid rgba(255, 217, 61, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 15px',
                    marginBottom: '20px',
                    display: 'inline-block'
                }}>
                    <span style={{
                        color: '#FFD93D',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        Round {currentRound} of {GAME_CONFIG.TOTAL_ROUNDS}
                    </span>
                </div>

                {/* Title */}
                <h2 style={{
                    color: '#FFD93D',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '0 0 8px 0'
                }}>
                    Schrödinger's Cat
                </h2>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    margin: '0 0 20px 0'
                }}>
                    Guess the quantum state of the cat:
                </p>

                {/* Choice Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    {/* Cat Dead Option */}
                    <button
                        onClick={() => onMakeChoice(GAME_CONFIG.CHOICES.DEAD)}
                        style={{
                            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '15px 12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            minWidth: '100px'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>💀</span>
                        <div>
                            <div style={{ fontSize: '14px' }}>Cat Dead</div>
                            <div style={{ 
                                fontSize: '11px', 
                                opacity: 0.8,
                                marginTop: '3px'
                            }}>
                                Mouse steals cheese
                            </div>
                        </div>
                    </button>

                    {/* Cat Alive Option */}
                    <button
                        onClick={() => onMakeChoice(GAME_CONFIG.CHOICES.ALIVE)}
                        style={{
                            background: 'linear-gradient(135deg, #6bcf7f, #4CAF50)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '15px 12px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            minWidth: '100px'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>😸</span>
                        <div>
                            <div style={{ fontSize: '14px' }}>Cat Alive</div>
                            <div style={{ 
                                fontSize: '11px', 
                                opacity: 0.8,
                                marginTop: '3px'
                            }}>
                                Cheese is safe
                            </div>
                        </div>
                    </button>
                </div>

                {/* Instructions */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '15px'
                }}>
                    <div style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '11px',
                        lineHeight: '1.4'
                    }}>
                        💡 The computer will randomly choose one state. 
                        You win if your guess matches the computer's choice!
                    </div>
                </div>

                {/* Close Game Button */}
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '10px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    🏃 Exit Game
                </button>
            </div>
        </div>
    );
};

export default ChoicePopup;