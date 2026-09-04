/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Indigo & Cobalt Enterprise Palette (Stripe / Linear style)
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary Electric Indigo
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        cobalt: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Primary Cobalt Accent
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        pewter: {
          light: '#64748B',
          blue: '#4F46E5',
          darkBlue: '#4338CA',
          taupe: '#64748B',
          darkTaupe: '#475569',
          stone: '#334155',
        },
        odyssey: {
          darkest: '#F8FAFC',
          primary: '#4F46E5',
          vibrant: '#2563EB',
          mint: '#10B981',
          taupe: '#64748B',
        },
        command: {
          50: '#FFFFFF',
          100: '#F8FAFC',
          200: '#F1F5F9',
          300: '#E2E8F0',
          400: '#CBD5E1',
          500: '#94A3B8',
          600: '#64748B',
          700: '#475569',
          800: '#334155',
          900: '#1E293B',
          950: '#0F172A',
          border: '#E2E8F0',
          'border-active': 'rgba(79, 70, 229, 0.4)',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        'clean-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'clean': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'clean-md': '0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'clean-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'clean-card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(226, 232, 240, 0.8)',
        'clean-card-hover': '0 8px 16px -2px rgba(79, 70, 229, 0.08), 0 0 0 1px rgba(79, 70, 229, 0.3)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }
    },
  },
  plugins: [],
}

