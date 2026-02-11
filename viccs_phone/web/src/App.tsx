import React, { useEffect } from 'react';
import { usePhoneStore } from './store/phoneStore';
import { AnimatePresence } from 'framer-motion';
import { Home } from './apps/Home';
import { SettingsApp } from './apps/Settings';
import { Dock } from './components/os/Dock';
import { LockScreen } from './components/os/LockScreen';
import { PhoneFrame } from './components/PhoneFrame';
import { usePhoneVisibility } from './hooks/usePhoneVisibility';
import { fetchNui } from './utils/fetchNui';
import './index.css';

const App: React.FC = () => {
    const { isVisible } = usePhoneVisibility();
    const { setVisible, locked, appStack, goBack, goHome, initSettings } = usePhoneStore();

    // Init Settings on load
    useEffect(() => {
        initSettings();
    }, [initSettings]);

    // Sync NUI visibility with Store
    useEffect(() => {
        setVisible(isVisible);
        // Also enable visible true for dev if not in game (mocked)
        if ((import.meta as any).env.MODE === 'development') {
            // setVisible(true); 
        }
    }, [isVisible, setVisible]);

    // Handle Keys (ESC to close, Backspace to go back)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                fetchNui('hideFrame');
            } else if (event.key === 'Backspace') {
                // If inputs are focused, don't navigate back
                const tagName = (event.target as HTMLElement).tagName;
                if (tagName !== 'INPUT' && tagName !== 'TEXTAREA') {
                    goBack();
                }
            } else if (event.key === 'Home') { // Optional: Home key for Home
                goHome();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goBack, goHome]);

    // NUCLEAR FIX: Force Body Transparency via JS
    useEffect(() => {
        document.body.style.backgroundColor = 'rgba(0,0,0,0)';
        document.body.style.background = 'transparent';
        document.documentElement.style.backgroundColor = 'rgba(0,0,0,0)';
    }, []);

    const currentApp = appStack.length > 0 ? appStack[appStack.length - 1] : null;

    return (
        <AnimatePresence>
            {isVisible && (
                // Pass isAppOpen to control wallpaper darkening separately from just "children" existence
                <PhoneFrame isAppOpen={!!currentApp}>
                    <AnimatePresence mode='wait'>
                        {locked ? (
                            <LockScreen key="lock" />
                        ) : (
                            <div className="h-full flex flex-col">
                                {/* App Content Area */}
                                <div className="flex-1 relative overflow-hidden">
                                    {currentApp ? (
                                        <div className="w-full h-full bg-transparent animate-fade-in">
                                            {currentApp === 'settings' && <SettingsApp />}
                                        </div>
                                    ) : (
                                        <Home key="home" />
                                    )}
                                </div>

                                {/* Dock (Only on Home) */}
                                {!currentApp && (
                                    <div className="px-4 pb-2">
                                        <Dock />
                                    </div>
                                )}
                            </div>
                        )}
                    </AnimatePresence>
                </PhoneFrame>
            )}
        </AnimatePresence>
    );
};

export default App;
