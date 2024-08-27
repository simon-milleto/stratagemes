import { defineConfig, defineGlobalStyles } from "@pandacss/dev"

const globalCss = defineGlobalStyles({
  'html, body': {
    scrollBehavior: 'smooth',
    fontFamily: "'Caudex', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
  }
})

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  globalCss,

  // Where to look for your css declarations
  include: [
    "./app/routes/**/*.{ts,tsx,js,jsx}",
    "./app/components/**/*.{ts,tsx,js,jsx}",
    "./app/root.tsx"
  ],

  // Files to exclude
  exclude: [],
  jsxFramework: 'react',

  // The output directory for your css system
  outdir: "styled-system",
  theme: {
    extend: {
      keyframes: {
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        toastSlideIn: {
          from: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
          to: { transform: 'translateX(0)' },
        },
        toastSwipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
      tokens: {
        sizes: {
          maxContainer: { value: '1260px' }
        },
        colors: {
          'main': {
            value: '#F1D272'
          },
          'main.light': {
            value: '#FFF4C2'
          },

          'dark': {
            value: '#261921'
          },
          'dark.secondary': {
            value: '#3D2F37'
          },
          'gem.red': {
            value: '#b34c4e'
          },
          'gem.blue': {
            value: '#3a64a0'
          },
          'gem.green': {
            value: '#789e76'
          },
          'gem.yellow': {
            value: '#dcc950'
          },
          'gem.white': {
            value: '#b4b5b3'
          },
          'gem.black': {
            value: '#383937'
          },
        }
      }
    }
  }
})