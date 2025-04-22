import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#6B7280',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF'
        },
        muted: {
          DEFAULT: '#F9FAFB',
          foreground: '#6B7280'
        },
        accent: {
          DEFAULT: '#E5E7EB',
          foreground: '#1F2937'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937'
        },
        sidebar: {
          DEFAULT: '#F9FAFB',
          foreground: '#1F2937',
          primary: '#3B82F6',
          'primary-foreground': '#FFFFFF',
          accent: '#E5E7EB',
          'accent-foreground': '#1F2937',
          border: '#E5E7EB',
          ring: '#3B82F6'
        },
        cc: {
          'agent-available': '#10B981',
          'agent-busy': '#EF4444',
          'agent-away': '#F59E0B',
          'agent-offline': '#D1D5DB',
          'agent-wrap': '#8B5CF6',
          'primary': '#3B82F6',
          'primary-light': '#93C5FD',
          'secondary': '#6B7280',
          'accent': '#E5E7EB',
          'dark': '#1F2937',
          'background': '#F9FAFB',
          'surface': '#FFFFFF',
          'border': '#E5E7EB',
          'disabled': '#D1D5DB',
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444',
          'info': '#3B82F6'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        'flash': {
          '0%, 50%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0.5' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-ring': 'pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite',
        'flash': 'flash 2s infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
