import { useEffect, useCallback } from 'react';
import { NeedsPanel } from './components/NeedsPanel';
import { VehicleHUD } from './components/VehicleHUD';
import { useNeedsStore } from './store';
import type { NUIMessage, NeedConfig } from './types';
import './index.css';

function App() {
    const {
        setNeeds,
        setConfig,
        updateNeed,
        updateStats,
        updateVehicle,
        setVehicleVisible,
        setWants,
        setWantsCatalog,
        setVisible,
        setMinimized,
        setPaused,
    } = useNeedsStore();

    // Define handleMessage outside useEffect to make it a stable reference
    const handleMessage = useCallback((event: MessageEvent<NUIMessage>) => {
        const { action, data } = event.data;

        switch (action) {
            case 'INIT_NEEDS': {
                const initData = data as {
                    needs: Record<string, { value: number; state: 'healthy' | 'warning' | 'critical' }>;
                    config: Record<string, NeedConfig>;
                };
                setNeeds(initData.needs);
                if (initData.config) {
                    setConfig(initData.config);
                }
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

            case 'UPDATE_VEHICLE': {
                // console.log('[HUD] Vehicle Update', data); // Commented out to reduce spam, uncomment if needed
                updateVehicle(data as any);
                break;
            }

            case 'TOGGLE_VEHICLE_HUD': {
                console.log('[HUD] Toggle Vehicle HUD:', data);
                setVehicleVisible((data as any).visible);
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
        }
    }, [setNeeds, setConfig, updateNeed, updateStats, updateVehicle, setVehicleVisible, setWants, setWantsCatalog, setVisible, setMinimized, setPaused]);

    useEffect(() => {
        window.addEventListener('message', handleMessage);

        // Notify client that NUI is ready
        fetch('https://viccs_needs/hudReady', {
            method: 'POST',
            body: JSON.stringify({}),
        }).catch(() => { });

        return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    return (
        <div className="w-screen h-screen relative overflow-hidden pointer-events-none select-none font-sans">
            {/* Needs Panel - Bottom Right (handled by its own CSS/position) */}
            <div className="absolute right-8 bottom-8 pointer-events-auto">
                <NeedsPanel />
            </div>

            {/* Vehicle HUD - Bottom Center */}
            <VehicleHUD />
        </div>
    );
}

export default App;
