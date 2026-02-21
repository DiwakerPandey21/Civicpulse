/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable dark mode
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1a365d',
                    dark: '#0f172a'
                },
                saffron: {
                    DEFAULT: '#FF9933',
                    50: '#fff5ec',
                    100: '#ffe8d3',
                    200: '#ffcda5',
                    300: '#ffae6d',
                    400: '#ff842d',
                    500: '#ff6204',
                    600: '#f04900',
                    700: '#c73501',
                    800: '#9e2b0a',
                    900: '#7f260b',
                },
                indiaGreen: {
                    DEFAULT: '#138808',
                    50: '#f2fdf2',
                    100: '#dffbe1',
                    200: '#bef5c3',
                    300: '#8de998',
                    400: '#55d466',
                    500: '#2eb840',
                    600: '#1e952d',
                    700: '#1a7627',
                    800: '#185d23',
                    900: '#154d1f',
                }
            },
            animation: {
                'marquee': 'marquee 25s linear infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
        },
    },
    plugins: [],
}
