import React from 'react';
import { useInstagramStore } from './store';
import { LoginScreen } from './screens/Login';
import { FeedScreen } from './screens/Feed';

export const Instagram: React.FC = () => {
    const { account } = useInstagramStore();

    // Check for existing session (e.g. if we want auto-login logic here or serverside)
    // For now, rely on manual login or persistent store if we persist state.

    if (!account) {
        return <LoginScreen />;
    }

    return (
        <FeedScreen />
        // Later: Add Tab Navigator here wrapping Feed/Profile
    );
};
