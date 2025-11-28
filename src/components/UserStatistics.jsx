import React, { useState, useEffect } from 'react';
import { MessageService } from '../services/messageService';
import { useAuth } from '../hooks/useAuth';
import './UserStatistics.css';

export default function UserStatistics() {
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [gameStatistics, setGameStatistics] = useState(null);
    const [gameLoading, setGameLoading] = useState(false);
    const [gameError, setGameError] = useState(null);

    const gameColors = {
        'won': '#4CAF50',
        'lost': '#F44336',
        'tied': '#FFC107'
    };

    const gameIcons = {
        'won': '🏆',
        'lost': '💔',
        'tied': '🤝'
    };

    const loadGameStatistics = async () => {
        if (!user) return;
        
        setGameLoading(true);
        setGameError(null);
        
        try {
            const gameStats = await MessageService.getUserGameStatistics(user.uid);
            setGameStatistics(gameStats);
        } catch (err) {
            setGameError('Failed to load game statistics');
            console.error('Error loading game statistics:', err);
        } finally {
            setGameLoading(false);
        }
    };

    useEffect(() => {
        if (isExpanded && user) {
            loadGameStatistics();
        }
    }, [isExpanded, user]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="user-statistics">
            <button 
                className="statistics-toggle"
                onClick={toggleExpand}
            >
                🎮 Game Statistics {isExpanded ? '▲' : '▼'}
            </button>

            {isExpanded && (
                <div className="statistics-content">
                    {gameLoading && (
                        <div className="statistics-loading">
                            <div className="loading-spinner"></div>
                            Loading game statistics...
                        </div>
                    )}

                    {gameError && (
                        <div className="statistics-error">
                            {gameError}
                        </div>
                    )}

                    {gameStatistics && gameStatistics.totalGames > 0 ? (
                        <div className="statistics-data">
                            <div className="statistics-header">
                                <h3>Game Performance</h3>
                                <div className="total-messages">
                                    Total Games: {gameStatistics.totalGames}
                                </div>
                            </div>

                            {/* Game Pie Chart Visualization */}
                            <div className="pie-chart-container">
                                <div className="pie-chart">
                                    <svg width="120" height="120" viewBox="0 0 120 120">
                                        <GamePieSegments statistics={gameStatistics} colors={gameColors} />
                                    </svg>
                                </div>
                                <div className="pie-legend">
                                    {gameStatistics.wins > 0 && (
                                        <div className="legend-item">
                                            <div 
                                                className="legend-color" 
                                                style={{ backgroundColor: gameColors.won }}
                                            ></div>
                                            <span className="legend-label">
                                                {gameIcons.won} Won
                                            </span>
                                            <span className="legend-value">
                                                {gameStatistics.wins} ({gameStatistics.winPercentage}%)
                                            </span>
                                        </div>
                                    )}
                                    {gameStatistics.losses > 0 && (
                                        <div className="legend-item">
                                            <div 
                                                className="legend-color" 
                                                style={{ backgroundColor: gameColors.lost }}
                                            ></div>
                                            <span className="legend-label">
                                                {gameIcons.lost} Lost
                                            </span>
                                            <span className="legend-value">
                                                {gameStatistics.losses} ({gameStatistics.lossPercentage}%)
                                            </span>
                                        </div>
                                    )}
                                    {gameStatistics.ties > 0 && (
                                        <div className="legend-item">
                                            <div 
                                                className="legend-color" 
                                                style={{ backgroundColor: gameColors.tied }}
                                            ></div>
                                            <span className="legend-label">
                                                {gameIcons.tied} Tied
                                            </span>
                                            <span className="legend-value">
                                                {gameStatistics.ties} ({gameStatistics.tiePercentage}%)
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Game Detailed Breakdown */}
                            <div className="detailed-breakdown">
                                <h4>Performance Breakdown</h4>
                                <div className="breakdown-item">
                                    <div className="breakdown-header">
                                        <span className="emotion-icon">{gameIcons.won}</span>
                                        <span className="emotion-name">Games Won</span>
                                        <span className="emotion-count">{gameStatistics.wins}</span>
                                    </div>
                                    <div className="breakdown-bar">
                                        <div 
                                            className="breakdown-fill"
                                            style={{
                                                width: `${gameStatistics.winPercentage}%`,
                                                backgroundColor: gameColors.won
                                            }}
                                        ></div>
                                    </div>
                                    <div className="breakdown-percentage">
                                        {gameStatistics.winPercentage}%
                                    </div>
                                </div>
                                <div className="breakdown-item">
                                    <div className="breakdown-header">
                                        <span className="emotion-icon">{gameIcons.lost}</span>
                                        <span className="emotion-name">Games Lost</span>
                                        <span className="emotion-count">{gameStatistics.losses}</span>
                                    </div>
                                    <div className="breakdown-bar">
                                        <div 
                                            className="breakdown-fill"
                                            style={{
                                                width: `${gameStatistics.lossPercentage}%`,
                                                backgroundColor: gameColors.lost
                                            }}
                                        ></div>
                                    </div>
                                    <div className="breakdown-percentage">
                                        {gameStatistics.lossPercentage}%
                                    </div>
                                </div>
                                {gameStatistics.ties > 0 && (
                                    <div className="breakdown-item">
                                        <div className="breakdown-header">
                                            <span className="emotion-icon">{gameIcons.tied}</span>
                                            <span className="emotion-name">Games Tied</span>
                                            <span className="emotion-count">{gameStatistics.ties}</span>
                                        </div>
                                        <div className="breakdown-bar">
                                            <div 
                                                className="breakdown-fill"
                                                style={{
                                                    width: `${gameStatistics.tiePercentage}%`,
                                                    backgroundColor: gameColors.tied
                                                }}
                                            ></div>
                                        </div>
                                        <div className="breakdown-percentage">
                                            {gameStatistics.tiePercentage}%
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : gameStatistics && gameStatistics.totalGames === 0 ? (
                        <div className="no-data">
                            No games played yet. Start playing to see your performance statistics!
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

// SVG Pie Chart Component for Games
function GamePieSegments({ statistics, colors }) {
    const centerX = 60;
    const centerY = 60;
    const radius = 50;
    
    let currentAngle = 0;
    const segments = [];

    // Create segments for wins, losses, ties
    const gameData = [
        { type: 'won', percentage: statistics.winPercentage, color: colors.won },
        { type: 'lost', percentage: statistics.lossPercentage, color: colors.lost },
        { type: 'tied', percentage: statistics.tiePercentage, color: colors.tied }
    ].filter(item => item.percentage > 0);

    gameData.forEach(({ type, percentage, color }) => {
        const angle = (percentage / 100) * 360;
        
        // Calculate start and end points for the arc
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        
        const startRadians = (startAngle - 90) * (Math.PI / 180);
        const endRadians = (endAngle - 90) * (Math.PI / 180);
        
        const startX = centerX + radius * Math.cos(startRadians);
        const startY = centerY + radius * Math.sin(startRadians);
        const endX = centerX + radius * Math.cos(endRadians);
        const endY = centerY + radius * Math.sin(endRadians);
        
        // Determine if the arc is large (more than 180 degrees)
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        // Create the path for the pie segment
        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            'Z'
        ].join(' ');
        
        segments.push(
            <path
                key={type}
                d={pathData}
                fill={color}
                stroke="#ffffff"
                strokeWidth="2"
            />
        );
        
        currentAngle += angle;
    });

    return (
        <g>
            {segments}
            {/* Center circle for donut effect (optional) */}
            <circle cx={centerX} cy={centerY} r={radius * 0.3} fill="white" />
        </g>
    );
}