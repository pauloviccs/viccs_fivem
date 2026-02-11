/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"SF Pro Display"', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                glass: {
                    100: 'rgba(255, 255, 255, 0.1)',   // Surface
                    200: 'rgba(255, 255, 255, 0.18)',  // Card
                    300: 'rgba(255, 255, 255, 0.28)',  // Highlight
                    border: 'rgba(255, 255, 255, 0.2)',
                    highlight: 'rgba(255, 255, 255, 0.5)',
                    text: {
                        primary: 'rgba(255, 255, 255, 0.98)',
                        secondary: 'rgba(255, 255, 255, 0.70)',
                        tertiary: 'rgba(255, 255, 255, 0.50)',
                    }
                },
                'simlife-bg': 'transparent', // REMOVED BLACK
            },
            backdropBlur: {
                'xs': '4px',
                'sm': '8px',
                'md': '16px',
                'lg': '24px',
                'xl': '32px',
                '2xl': '48px',
                '3xl': '64px',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
                'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
                'glow': '0 0 20px rgba(255, 255, 255, 0.15)',
            },
            animation: {
                'ios-spring': 'spring 0.5s cubic-bezier(0.15, 1.15, 0.35, 1.05)',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            },
            keyframes: {
                spring: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
