import { useState, useEffect, useRef } from "react";


/**
 * A hook that manages the visibility status of the NUI.
 * Listens for the "setVisible" action.
 */
export const usePhoneVisibility = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const { action, data } = event.data;
            if (action === "setVisible") {
                setIsVisible(data);
            }
        };

        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    }, []);

    return { isVisible, setIsVisible };
};

// Generic hook for listening to NUI events
interface NuiMessageData<T = unknown> {
    action: string;
    data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

export const useNuiEvent = <T = any>(action: string, handler: (data: T) => void) => {
    const savedHandler = useRef<NuiHandlerSignature<T>>();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
            const { action: eventAction, data } = event.data;

            if (savedHandler.current && eventAction === action) {
                savedHandler.current(data);
            }
        };

        window.addEventListener("message", eventListener);
        return () => window.removeEventListener("message", eventListener);
    }, [action]);
};
