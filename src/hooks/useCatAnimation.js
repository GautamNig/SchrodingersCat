import { useState, useEffect, useRef, useCallback } from 'react';
import { useRive } from '@rive-app/react-webgl2';

export default function useCatAnimation() {
    const [animationKey, setAnimationKey] = useState(0);
    const [riveLoaded, setRiveLoaded] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [mouseAnimReady, setMouseAnimReady] = useState(false);
    const [buttonAnimReady, setButtonAnimReady] = useState(false);
    
    const mouseAnimInputRef = useRef(null);
    const buttonAnimInputRef = useRef(null);
    const riveInstanceRef = useRef(null);
    const inputsAttachedRef = useRef(false);

    const { RiveComponent, rive } = useRive({
        src: `${import.meta.env.BASE_URL}rive/19556-36763-cat-in-a-box.riv`,
        autoplay: true,
        stateMachines: ["State Machine 1"],
        onLoad: () => {
            console.log('✅ Rive onLoad called');
            riveInstanceRef.current = rive;
        },
        onLoadError: (error) => {
            console.error('❌ Rive loading error:', error);
            setRiveLoaded(false);
        },
    });

    const attachInputs = useCallback(() => {
        if (!rive) {
            return false;
        }

        try {
            const inputs = rive.stateMachineInputs("State Machine 1");
            
            if (!inputs || !Array.isArray(inputs)) {
                return false;
            }

            let mouseFound = false;
            let buttonFound = false;

            inputs.forEach(input => {
                if (input.name === 'mouse') {
                    mouseAnimInputRef.current = input;
                    mouseFound = true;
                    console.log('✅ mouse input attached');
                } else if (input.name === 'button press') {
                    buttonAnimInputRef.current = input;
                    buttonFound = true;
                    console.log('✅ button press input attached');
                }
            });

            // Update ready states
            setMouseAnimReady(mouseFound && !isResetting);
            setButtonAnimReady(buttonFound && !isResetting);
            inputsAttachedRef.current = mouseFound || buttonFound;

            return mouseFound || buttonFound;
        } catch (error) {
            console.error('❌ Error attaching inputs:', error);
            return false;
        }
    }, [rive, isResetting]);

    // Input attachment with polling
    useEffect(() => {
        if (isResetting) {
            return;
        }

        if (!rive) {
            return;
        }

        // Try immediate attach
        if (attachInputs()) {
            setRiveLoaded(true);
            return;
        }

        // Poll until inputs attach
        let attempts = 0;
        const maxAttempts = 30;
        const intervalMs = 150;
        
        const interval = setInterval(() => {
            attempts++;
            const ok = attachInputs();
            if (ok) {
                clearInterval(interval);
                setRiveLoaded(true);
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                setRiveLoaded(false);
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [rive, isResetting, attachInputs]);

    const triggerMouse = useCallback(() => {
        if (isResetting) {
            return false;
        }

        if (!riveLoaded || !mouseAnimInputRef.current) {
            return false;
        }

        try {
            const input = mouseAnimInputRef.current;
            
            if (input.fire && typeof input.fire === 'function') {
                input.fire();
            } else if (input.value !== undefined) {
                input.value = true;
                setTimeout(() => {
                    if (mouseAnimInputRef.current) {
                        mouseAnimInputRef.current.value = false;
                    }
                }, 100);
            } else {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error triggering mouse:', error);
            return false;
        }
    }, [riveLoaded, isResetting]);

    const triggerButtonPress = useCallback(() => {
        if (isResetting) {
            return false;
        }

        if (!riveLoaded || !buttonAnimInputRef.current) {
            return false;
        }

        try {
            const input = buttonAnimInputRef.current;
            
            if (input.fire && typeof input.fire === 'function') {
                input.fire();
            } else if (input.value !== undefined) {
                input.value = true;
                setTimeout(() => {
                    if (buttonAnimInputRef.current) {
                        buttonAnimInputRef.current.value = false;
                    }
                }, 100);
            } else {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error triggering button press:', error);
            return false;
        }
    }, [riveLoaded, isResetting]);

    const resetAnimation = useCallback(() => {
        console.log('🔄 Resetting Rive animation');
        
        setIsResetting(true);
        setRiveLoaded(false);
        setMouseAnimReady(false);
        setButtonAnimReady(false);
        inputsAttachedRef.current = false;
        
        mouseAnimInputRef.current = null;
        buttonAnimInputRef.current = null;
        
        if (riveInstanceRef.current) {
            try {
                riveInstanceRef.current.stop();
                riveInstanceRef.current.cleanup();
            } catch (e) {
                console.log('Rive cleanup error:', e);
            }
        }
        
        setAnimationKey(prev => prev + 1);
        
        setTimeout(() => {
            setIsResetting(false);
        }, 500);
    }, []);

    return {
        RiveComponent,
        rive,
        riveLoaded,
        triggerMouse,
        triggerButtonPress,
        resetAnimation,
        animationKey,
        isResetting,
        mouseAnimReady,
        buttonAnimReady
    };
}