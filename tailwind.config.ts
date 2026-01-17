import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--secondary))',
                muted: 'hsl(var(--muted))',
                accent: 'hsl(var(--accent))',
                popover: 'hsl(var(--popover))',
                card: 'hsl(var(--card))',
            },
        },
    },
    plugins: [],
};

export default config;
