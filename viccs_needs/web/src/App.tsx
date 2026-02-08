import { useEffect } from 'react';
import { NeedsPanel } from './components/NeedsPanel';
import { useNeedsStore } from './store';
import type { NUIMessage, NeedConfig } from './types';

function App() {
    const {
        setNeeds,
        setConfig,
        updateNeed,
        updateStats,
        setWants,
        setWantsCatalog,
        setVisible,
        setMinimized,
        setPaused,
    } = useNeedsStore();

    useEffect(() => {
        // Listen for NUI messages from Lua
        const handleMessage = (event: MessageEvent<NUIMessage>) => {
            const { action, data } = event.data;

            switch (action) {
                case 'INIT_NEEDS': {
                    // Data comes with needs already containing {value, state}
                    const initData = data as {
                        needs: Record<string, { value: number; state: 'healthy' | 'warning' | 'critical' }>;
                        config: Record<string, NeedConfig>;
                    };
                    setNeeds(initData.needs);
                    if (initData.config) {
                        setConfig(initData.config);
                    }
                    console.log('[SimLife HUD] Initialized needs:', initData.needs);
                    break;
                }

                case 'INIT_CONFIG': {
                    const configData = data as {
                        hudConfig: unknown;
                        needsConfig: Record<string, NeedConfig>;
                        wantsConfig: { catalog: unknown };
                    };
                    if (configData.needsConfig) {
                        setConfig(configData.needsConfig);
                    }
                    if (configData.wantsConfig?.catalog) {
                        setWantsCatalog(configData.wantsConfig.catalog as never);
                    }
                    // Notify Lua that HUD is ready
                    fetch('https://viccs_needs/hudReady', {
                        method: 'POST',
                        body: JSON.stringify({}),
                    }).catch(() => { });
                    console.log('[SimLife HUD] Config received');
                    break;
                }

                case 'UPDATE_NEED': {
                    const updateData = data as {
                        name: string;
                        value: number;
                        state: 'healthy' | 'warning' | 'critical'
                    };
                    updateNeed(updateData.name, updateData.value, updateData.state);
                    break;
                }

                case 'UPDATE_ALL_NEEDS': {
                    const allData = data as {
                        needs: Record<string, { value: number; state: 'healthy' | 'warning' | 'critical' }>
                    };
                    setNeeds(allData.needs);
                    break;
                }

                case 'UPDATE_STATUS': {
                    const statusData = data as { health: number; armor: number };
                    updateStats(statusData.health, statusData.armor);
                    break;
                }

                case 'SYNC_WANTS': {
                    const wantsData = data as { wants: never[]; catalog?: unknown };
                    setWants(wantsData.wants);
                    if (wantsData.catalog) {
                        setWantsCatalog(wantsData.catalog as never);
                    }
                    break;
                }

                case 'TOGGLE_VISIBILITY': {
                    const visData = data as { visible: boolean };
                    setVisible(visData.visible);
                    break;
                }

                case 'SET_MINIMIZED': {
                    const minData = data as { minimized: boolean };
                    setMinimized(minData.minimized);
                    break;
                }

                case 'SET_PAUSED': {
                    const pauseData = data as { paused: boolean };
                    setPaused(pauseData.paused);
                    break;
                }

                case 'NEED_CRITICAL':
                case 'WANT_COMPLETED':
                    // Visual effects handled by components
                    break;
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [setNeeds, setConfig, updateNeed, setWants, setWantsCatalog, setVisible, setMinimized, setPaused]);

    return (
        <div className="w-full h-full pointer-events-none">
            <NeedsPanel />
        </div>
    );
}

export default App;
