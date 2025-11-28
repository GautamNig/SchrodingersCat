// src/components/CheckingTooltip.jsx
import React, { useEffect, useState } from 'react';

const CheckingTooltip = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '12px',
            padding: '20px 25px',
            zIndex: 10001,
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease',
            maxWidth: '300px',
            width: '80%'
        }}>
            <div style={{
                fontSize: '24px',
                marginBottom: '10px'
            }}>
                🔬
            </div>
            <h3 style={{
                color: '#FFD93D',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: '0 0 8px 0'
            }}>
                Observing Quantum State
            </h3>
            <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                margin: 0
            }}>
                Checking if cat is dead or alive{dots}
            </p>
            <div style={{
                marginTop: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '11px',
                fontStyle: 'italic'
            }}>
                The wavefunction is collapsing...
            </div>
        </div>
    );
};

export default CheckingTooltip;