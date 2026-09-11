/** index.html にインラインで書かれていた設定をそのまま切り出したもの */
module.exports = Object.assign({content:['./index.html','./app.js']}, {
            theme: {
                extend: {
                    colors: {
                        skin: {
                            cream: '#fff8f5',
                            peach: '#fce8df',
                            blush: '#f5cec7',
                            pink: '#e8a5a0',
                            rose: '#d4847e',
                            muted: '#c09090',
                            dark: '#6b4545',
                            text: '#5a4040',
                            gray: '#8a7070',
                        }
                    },
                    fontFamily: {
                        sans: ['Noto Sans JP', 'sans-serif'],
                    },
                    animation: {
                        'float': 'float 3s ease-in-out infinite',
                        'flash-text': 'flashText 2s ease-in-out infinite',
                        'fade-in': 'fadeIn 0.4s ease-out forwards',
                        'scale-up': 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-6px)' },
                        },
                        flashText: {
                            '0%, 100%': { opacity: '0.9', color: '#ffffff', textShadow: '0 0 5px rgba(255,255,255,0.5)' },
                            '50%': { opacity: '1', color: '#FFDF73', textShadow: '0 0 10px rgba(255,223,115,0.8)' },
                        },
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' },
                        },
                        scaleUp: {
                            '0%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
                            '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                        }
                    }
                }
            }
        });
