/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.antlers.html',
        './resources/**/*.antlers.php',
        './resources/**/*.blade.php',
        './resources/**/*.vue',
        './content/**/*.md',
    ],

    theme: {
        extend: {
            colors: {
                dataphyteblue: '#2f70a8',
                dataphytegreen: '#336b82',
                dataphytelightblue: '#4fa6de',
                dataphytered: '#b52408',
            },
        },
    },

    plugins: [
        require('@tailwindcss/typography'),
    ],
};
