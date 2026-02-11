import React from 'react';
import {
    ChevronRight,
    Wifi,
    Bluetooth,
    Bell,
    Moon,
    Smartphone,
    Image as ImageIcon,
    User
} from 'lucide-react';
import { WallpaperPicker } from './pages/Wallpaper';
import { GlassPage } from '../../components/shared/GlassPage';
import { cn } from '../../utils/cn';

interface SettingsItemProps {
    icon: React.ElementType;
    label: string;
    value?: string;
    color: string;
    onClick?: () => void;
    toggle?: boolean;
    isLast?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, label, value, color, onClick, toggle, isLast }) => (
    <div
        onClick={onClick}
        className={cn(
            "group relative flex items-center justify-between p-4 transition-all duration-300 cursor-pointer",
            "hover:bg-glass-200/50 active:bg-glass-300/50 active:scale-[0.99]", // Interactive states
            // BORDER SEPARATOR logic: only show border if NOT the last item
            !isLast && "border-b border-glass-border/50"
        )}
    >
        <div className="flex items-center gap-3">
            <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center text-white shadow-sm",
                color
            )}>
                <Icon size={14} />
            </div>
            <span className="text-[17px] font-medium text-glass-text-primary">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {value && <span className="text-[15px] text-glass-text-secondary">{value}</span>}
            {!toggle && <ChevronRight size={16} className="text-glass-text-tertiary group-hover:text-glass-text-secondary transition-colors" />}
            {toggle && (
                <div className="w-10 h-6 bg-green-500 rounded-full relative shadow-inner">
                    <div className="absolute right-0.5 top-0.5 bottom-0.5 w-5 bg-white rounded-full shadow-sm" />
                </div>
            )}
        </div>
    </div>
);

const SettingsGroup: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 px-4">
        {title && <h3 className="text-glass-text-tertiary text-xs font-semibold uppercase mb-2 ml-4 tracking-wide">{title}</h3>}
        <div className="flex flex-col rounded-xl overflow-hidden bg-glass-200 backdrop-blur-xl border border-glass-border/30 shadow-glass-sm">
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        // Pass isLast prop automatically
                        isLast: index === React.Children.count(children) - 1
                    });
                }
                return child;
            })}
        </div>
    </div>
);

export const SettingsApp: React.FC = () => {
    const [page, setPage] = React.useState<'main' | 'wallpaper'>('main');

    if (page === 'wallpaper') {
        return <WallpaperPicker />;
    }

    return (
        <GlassPage>
            <h1 className="text-glass-text-primary text-3xl font-bold px-6 mb-4 mt-2 tracking-tight drop-shadow-sm">Settings</h1>

            {/* Account Profile - Liquid Card */}
            <div className="px-4 mb-6">
                <div className="flex items-center gap-4 p-4 rounded-xl cursor-pointer bg-glass-200 hover:bg-glass-300 backdrop-blur-xl border border-glass-border/30 shadow-glass-sm transition-all active:scale-[0.98]">
                    <div className="w-14 h-14 bg-gray-500/30 rounded-full overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                        <User size={28} className="text-white/80" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-glass-text-primary font-semibold text-lg tracking-tight truncate">Viccs Player</span>
                        <span className="text-glass-text-tertiary text-sm truncate">Apple ID, iCloud, Media & Purchases</span>
                    </div>
                    <ChevronRight size={18} className="text-glass-text-tertiary ml-auto shrink-0" />
                </div>
            </div>

            {/* Connectivity Group */}
            <SettingsGroup>
                <SettingsItem icon={Wifi} label="Wi-Fi" value="SimLife_5G" color="bg-blue-500" />
                <SettingsItem icon={Bluetooth} label="Bluetooth" value="On" color="bg-blue-500" />
            </SettingsGroup>

            {/* Notifications & Sounds */}
            <SettingsGroup>
                <SettingsItem icon={Bell} label="Notifications" color="bg-red-500" />
                <SettingsItem icon={Smartphone} label="Sounds & Haptics" color="bg-pink-500" />
                <SettingsItem icon={Moon} label="Focus" color="bg-indigo-500" />
            </SettingsGroup>

            {/* General */}
            <SettingsGroup>
                <SettingsItem
                    icon={ImageIcon}
                    label="Wallpaper"
                    color="bg-cyan-500"
                    onClick={() => setPage('wallpaper')}
                />
            </SettingsGroup>
        </GlassPage>
    );
};
