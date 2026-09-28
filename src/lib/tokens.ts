/**
 * Tokens de Design do Aplicativo Recomeça
 *
 * Princípios visuais: Calmo, acolhedor, arredondado, amigável, mobile-first.
 * Regra fundamental: O coral (#E86A4C / #F07856) é de uso EXCLUSIVO do botão SOS.
 * Tipografia base: Nunito (400, 600, 700).
 */

export const designTokens = {
  // Paleta de Cores Modo Claro
  colors: {
    light: {
      primary: '#7FBFA8',
      primaryHover: '#6DA98F',
      background: '#FDFAF5',
      surface: '#F4F7F2',
      highlight: '#E8F3EC',
      textPrimary: '#2F4A3E',
      textSecondary: '#6A7A72',
      border: '#E1E8E2',

      // SOS Coral — EXCLUSIVO para o botão de emergência/apoio urgente
      sos: '#E86A4C',
      sosHover: '#D95C3F',
      sosForeground: '#FFFFFF',

      // Feedback
      feedbackSuccess: '#4CAF7D',
      feedbackWarning: '#E8A84C',
      feedbackError: '#D96C68',
      feedbackInfo: '#6CA8D6',

      // Estados
      stateDisabledBg: '#C4CFC8',
      stateDisabledText: '#8FA096',
      stateFocusOutline: '#6DA98F',
    },
    // Paleta de Cores Modo Escuro (prefers-color-scheme)
    dark: {
      primary: '#8FCCAE',
      primaryHover: '#A3D9C0',
      background: '#1C2420',
      surface: '#242E29',
      highlight: '#2A3831',
      textPrimary: '#E8EFE9',
      textSecondary: '#A0B0A7',
      border: '#2D3A34',

      // SOS no modo escuro (ajustado para contraste em fundo escuro)
      sos: '#F07856',
      sosHover: '#FF8A6A',
      sosForeground: '#FFFFFF',

      // Feedback
      feedbackSuccess: '#5DBF8C',
      feedbackWarning: '#F2B45A',
      feedbackError: '#E57D7A',
      feedbackInfo: '#7EB8E4',

      // Estados
      stateDisabledBg: '#35433C',
      stateDisabledText: '#6B7D73',
      stateFocusOutline: '#8FCCAE',
    },
  },

  // Tipografia (Nunito)
  typography: {
    fontFamily: {
      primary:
        'Nunito, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    weights: {
      regular: 400,
      semibold: 600,
      bold: 700,
    },
    scale: {
      // Microtexto e labels de apoio/badges
      micro: {
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: 600,
      },
      // Suporte e metadados
      support: {
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: 400,
      },
      // Corpo padrão (texto base)
      body: {
        fontSize: '16px',
        lineHeight: '24px', // 1.5
        fontWeight: 400,
      },
      // Subtítulo de seções e cartões (h3)
      subtitle: {
        fontSize: '18px',
        lineHeight: '24px', // 1.3
        fontWeight: 600,
      },
      // Título de tela e seções principais (h2)
      screenTitle: {
        fontSize: '22px',
        lineHeight: '28px', // 1.25
        fontWeight: 700,
      },
      // Display principal (mobile)
      displayMobile: {
        fontSize: '28px',
        lineHeight: '34px',
        fontWeight: 700,
      },
      // Display principal (tablet/desktop)
      displayDesktop: {
        fontSize: '36px',
        lineHeight: '44px',
        fontWeight: 700,
      },
      // Números grandes de contadores (dias limpos)
      counterMobile: {
        fontSize: '44px',
        lineHeight: '48px',
        fontWeight: 700,
      },
      counterDesktop: {
        fontSize: '60px',
        lineHeight: '64px',
        fontWeight: 700,
      },
    },
  },

  // Espaçamento (Escala de 4px)
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

  // Layout responsivo
  layout: {
    screenMargin: {
      mobile: '16px',
      tablet: '24px',
      desktop: '32px',
    },
    maxWidth: {
      mobile: '480px',
      tablet: '600px',
      desktop: '720px',
    },
    minTouchTarget: '44px',
  },

  // Raios de borda (extremamente arredondados)
  radii: {
    sm: '8px', // chips, badges
    md: '12px', // campos de texto, inputs
    lg: '16px', // botões, cards pequenos
    xl: '20px', // cards grandes
    full: '999px', // pill, avatares, botões redondos
  },

  // Sombras suaves e difusas
  shadows: {
    light: {
      sm: '0 1px 2px rgba(47, 74, 62, 0.06)',
      md: '0 2px 8px rgba(47, 74, 62, 0.08)',
      lg: '0 4px 16px rgba(47, 74, 62, 0.12)',
      xl: '0 8px 24px rgba(232, 106, 76, 0.3)',
      sos: '0 8px 24px rgba(232, 106, 76, 0.3)',
    },
    dark: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.25)',
      md: '0 2px 8px rgba(0, 0, 0, 0.35)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.45)',
      xl: '0 8px 24px rgba(240, 120, 86, 0.35)',
      sos: '0 8px 24px rgba(240, 120, 86, 0.35)',
    },
  },

  // Estados e Transições
  transitions: {
    durations: {
      hover: '150ms',
      base: '200ms',
      entryExit: '300ms',
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    activeScale: 'scale(0.98)',
  },

  // Z-Index Semântico
  zIndex: {
    base: 0,
    card: 1,
    header: 10,
    navigation: 20,
    modalBackdrop: 40,
    modalContent: 50,
    sosButton: 60, // Permanentemente acima para acesso imediato
    toast: 70,
  },

  // Mensagens do Sistema e Diretrizes de Tom de Voz
  voiceAndTone: {
    principles: [
      'Simplicidade: frases curtas em português comum, sem termos clínicos.',
      'Gentileza: acolhimento e escuta sem julgamento, sem culpa.',
      'Segurança: parar de uma vez pode ser perigoso, nunca sugerir doses.',
      'Esperança realista: um dia de cada vez, recaída faz parte da jornada.',
    ],
    legalNotices: {
      general: 'Este app não substitui tratamento. Em emergência, ligue 192.',
      medicalConsult: 'Parar de uma vez pode ser perigoso. Converse com um médico antes.',
    },
    errorMessagesExample: {
      fieldRequired: 'Precisamos disso para continuar. Pode preencher de novo?',
      connectionFailed: 'Não conseguimos salvar agora. Vamos tentar de novo em instantes?',
    },
  },
} as const

export type DesignTokens = typeof designTokens
