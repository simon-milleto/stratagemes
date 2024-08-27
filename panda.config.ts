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

          'dark': {
            value: '#261921'
          },
          'dark.secondary': {
            value: '#3D2F37'
          },
        }
      }
    }
  }
})