/**
 * Simple wrapper around fetch API tailored for CEF/NUI use.
 * @param eventName - The endpoint eventname to call (e.g. "hideFrame")
 * @param data - The data to send
 * @param mockData - The mock data to return in browser environment
 */
export const fetchNui = async (eventName: string, data?: any, mockData?: any): Promise<any> => {
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
    };

    if ((import.meta as any).env.MODE === 'development' && (window as any).invokeNative === undefined) {
        // Browser Environment (Mock)
        console.log(`[Mock NUI] Call: ${eventName}`, data);
        return mockData || {};
    }

    try {
        const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'viccs_phone';
        const resp = await fetch(`https://${resourceName}/${eventName}`, options);
        const respBody = await resp.json();
        return respBody;
    } catch (e) {
        console.error(`[Viccs Phone] Failed to fetch NUI callback ${eventName}`, e);
        // Don't reject, just return null to prevent app crash on failed NUI call (common during dev)
        return null;
    }
};
