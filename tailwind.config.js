/** @type {import('tailwindcss').Config} */

export default {
  purge: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  content: [
    './node_modules/flyonui/dist/js/*.js'
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-light': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 10px 15px rgba(0, 0, 0, 0.3)',
        'custom-blue': '0 0 10px rgba(59, 130, 246, 0.5)'
      }
    },
    screens: {
      'w1': '600px',
      'w2': '800px',
      'w3': '1000px',
      'w4': '1200px',
      'w5': '1400px',
      'w6': '1600px',
      'w7': '1800px',
      'w8': '2000px',
      'w9': '2200px',
      'w10': '2400px'
    }
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('flyonui'),
    require('flyonui/plugin')
  ]
}

