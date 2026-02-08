/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // SimLife color palette - desaturated and premium
                simlife: {
                    bg: 'rgba(15, 15, 20, 0.85)',
                    panel: 'rgba(25, 25, 35, 0.9)',
                    border: 'rgba(255, 255, 255, 0.08)',
                },
                // Need states
                need: {
                    healthy: '#4ade80',
                    warning: '#facc15',
                    critical: '#f87171',
                }
            },
            backdropBlur: {
                'glass': '12px',
            },
            animation: {
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.2s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
            },
            keyframes: {
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-in': {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
