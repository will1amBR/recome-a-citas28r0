/* Tailwind config for the frontend react app. This is where the app theme should be defined: https://v2.tailwindcss.com/docs/configuration. */
import type { Config } from 'tailwindcss'
import animatePlugin from 'tailwindcss-animate'
import typographyPlugin from '@tailwindcss/typography'
import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem', // 16px mobile
        sm: '1.25rem', // 20px
        md: '1.5rem', // 24px tablet
        lg: '2rem', // 32px desktop
      },
      screens: {
        sm: '480px',
        md: '600px',
        lg: '720px',
        xl: '720px',
        '2xl': '720px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Shadcn UI tokens mapeados
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },

        // Cores semânticas diretas do Recomeça
        recomeca: {
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          background: 'var(--color-background)',
          surface: 'var(--color-surface)',
          highlight: 'var(--color-highlight)',
          text: 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          border: 'var(--color-border)',
          // SOS Coral — USO EXCLUSIVO
          sos: 'var(--color-sos)',
          'sos-hover': 'var(--color-sos-hover)',
          'sos-fg': 'var(--color-sos-foreground)',
          // Feedback
          success: 'var(--color-feedback-success)',
          warning: 'var(--color-feedback-warning)',
          error: 'var(--color-feedback-error)',
          info: 'var(--color-feedback-info)',
          // Estados
          disabled: 'var(--color-state-disabled-bg)',
          'disabled-text': 'var(--color-state-disabled-text)',
          focus: 'var(--color-state-focus)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)', // 8px
        md: 'var(--radius-md)', // 12px
        lg: 'var(--radius-lg)', // 16px
        xl: 'var(--radius-xl)', // 20px
        full: 'var(--radius-full)', // 999px
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      maxWidth: {
        mobile: '480px',
        tablet: '600px',
        desktop: '720px',
      },
      boxShadow: {
        'recomeca-sm': 'var(--shadow-sm)',
        'recomeca-md': 'var(--shadow-md)',
        'recomeca-lg': 'var(--shadow-lg)',
        'recomeca-xl': 'var(--shadow-xl)',
        'recomeca-sos': 'var(--shadow-sos)',
      },
      transitionDuration: {
        hover: '150ms',
        base: '200ms',
        entry: '300ms',
      },
      transitionTimingFunction: {
        recomeca: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        card: '1',
        header: '10',
        navigation: '20',
        modalBackdrop: '40',
        modalContent: '50',
        sosButton: '60',
      },
    },
  },
  plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
} satisfies Config
