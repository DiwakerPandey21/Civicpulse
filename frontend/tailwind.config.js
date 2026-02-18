/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable class-based dark mode
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                saffron: {
                    500: '#FF9933', // Indian Flag Saffron
                    600: '#E68A00',
                },
                indiaGreen: {
                    500: '#138808', // Indian Flag Green
                    600: '#0E6606',
                },
                navyBlue: '#000080', // Ashoka Chakra
            }
        },
    },
    plugins: [],
}
