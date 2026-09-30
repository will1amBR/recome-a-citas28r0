/**
 * Mock Data do Projeto Recomeça
 * Dados fictícios, humanizados e sem dados clínicos reais.
 * Frase-guia: "Um dia de cada vez. Recomeçar faz parte."
 */

export interface TrackedHabit {
  id: string
  name: string
  category: 'substancia' | 'bebida-estimulante' | 'remedio'
  goalType: 'parar' | 'reduzir'
  currentStreakDays: number
  bestStreakDays: number
  cleanDaysThisMonth: number
  milestoneGoalDays: number
  dailyLimit?: number // ex: 2 xícaras ou 1 unidade para quem está reduzindo
  dailyCurrent?: number
  unit?: string
  startDate: string
  highRiskAbstinence?: boolean
}

export interface SupportContact {
  name: string
  relationship: string
  phone: string // ex: "11987654321"
  displayPhone: string
  hasConsent: boolean
}

export interface CravingEpisode {
  id: string
  time?: string
  dayOrPeriod?: string // ex: "Hoje de manhã", "Ontem à noite", "Terça-feira"
  whatBefore?: string // o que estava acontecendo antes
  whatAfter?: string // e depois, o que aconteceu
  intensity?: 'leve' | 'moderada' | 'forte'
}

export interface DailyCheckin {
  id: string
  date: string
  mood: 'otimo' | 'bem' | 'neutro' | 'dificil' | 'muito-dificil'
  usedToday: boolean
  amountUsed?: string
  feltCraving: boolean
  cravings?: CravingEpisode[]
  notes?: string
}

export interface EpisodeReceipt {
  spentAmount: number // em Reais
  arrivalTime: string // ex: "20:30"
  departureTime: string // ex: "23:45"
  durationMinutes: number
  itemsConsumed: string[]
  receiptPhotoUrl?: string
}

export interface EpisodeLog {
  id: string
  date: string // ISO string ou YYYY-MM-DD
  time: string
  substanceName: string
  amountDescription: string
  mood: string
  triggers: string[]
  freeText: string
  whatHappenedBefore?: string
  whatHappenedAfter: string
  cravingTime?: string
  receipt?: EpisodeReceipt
}

export interface DayCalendarStatus {
  date: string // YYYY-MM-DD
  status: 'limpo' | 'reducao' | 'recaida' | 'dificil'
  label: string
  notes?: string
  spentAmount?: number
  consequences?: string[]
}

export interface MonthlyMirror {
  monthName: string
  year: number
  totalSpent: number
  previousMonthSpent: number
  totalHoursSpent: number
  relapseDaysCount: number
  cleanDaysCount: number
  recordedConsequences: { label: string; count: number }[]
  gentleComparisonMessage: string
}

export interface PrescribedMedication {
  id: string
  name: string
  doctorName?: string
  scheduledTime: string // ex: "08:00"
  takenToday: boolean
  notes?: string
}

export interface SupportOrganization {
  id: string
  name: string
  shortName: string
  description: string
  url: string
  phone?: string
  phoneDisplay?: string
  emergencyBadge?: string
}

export interface ScreenQuestion {
  id: string
  text: string
}

// -------------------------------------------------------------
// DADOS INICIAIS MOCKADOS
// -------------------------------------------------------------

export const MOCK_USER = {
  name: 'Camila Silva',
  preferredGreeting: 'Camila',
  avatarSeed: 'recomeca-user-42',
  sinceYear: 2024,
  anonymousId: 'rec_84a92f',
}

export const MOCK_CONTACT: SupportContact = {
  name: 'Mariana (Irmã)',
  relationship: 'Irmã',
  phone: '11987654321',
  displayPhone: '(11) 98765-4321',
  hasConsent: true,
}

export const MOCK_TRACKED_HABITS: TrackedHabit[] = [
  {
    id: 'habit-1',
    name: 'Álcool',
    category: 'substancia',
    goalType: 'parar',
    currentStreakDays: 19,
    bestStreakDays: 34,
    cleanDaysThisMonth: 23,
    milestoneGoalDays: 21,
    startDate: '2025-04-10',
    highRiskAbstinence: true,
  },
  {
    id: 'habit-2',
    name: 'Café e Energético',
    category: 'bebida-estimulante',
    goalType: 'reduzir',
    currentStreakDays: 8,
    bestStreakDays: 14,
    cleanDaysThisMonth: 21,
    milestoneGoalDays: 30,
    dailyLimit: 2,
    dailyCurrent: 1,
    unit: 'xícaras',
    startDate: '2025-04-20',
    highRiskAbstinence: false,
  },
]

export const DAILY_INSPIRATION_PHRASES: string[] = [
  'Um dia de cada vez. O progresso de hoje já é todinho seu.',
  'Recomeçar não apaga seus passos. Toda caminhada tem pausas.',
  'Respire fundo. A vontade passa como uma onda no mar.',
  'Seja gentil com você mesmo. Você está cuidando de quem importa.',
  'Mais importante que a velocidade é o rumo que você escolheu.',
  'Cada escolha consciente fortalece a sua liberdade amanhã.',
]

export const MOCK_LAST_EPISODE: EpisodeLog = {
  id: 'ep-last',
  date: '2025-04-09',
  time: '21:30',
  substanceName: 'Álcool',
  amountDescription: '3 copos de chope com a turma do trabalho',
  mood: 'dificil',
  triggers: ['estresse', 'festa', 'trabalho'],
  freeText:
    'Fim de semana tenso no serviço, acabei aceitando o convite para o happy hour sem planejar como sair antes.',
  whatHappenedAfter: 'Dor de cabeça no dia seguinte, cansaço extremo e arrependimento leve.',
  receipt: {
    spentAmount: 114.5,
    arrivalTime: '19:40',
    departureTime: '23:10',
    durationMinutes: 210,
    itemsConsumed: ['3 chopes artesanais', '1 porção de batatas'],
  },
}

export const MOCK_MONTHLY_MIRROR: MonthlyMirror = {
  monthName: 'Abril',
  year: 2025,
  totalSpent: 114.5,
  previousMonthSpent: 160.0,
  totalHoursSpent: 3.5,
  relapseDaysCount: 1,
  cleanDaysCount: 27,
  recordedConsequences: [
    { label: 'Cansaço no dia seguinte', count: 1 },
    { label: 'Culpa passageira', count: 1 },
    { label: 'Gastos não planejados', count: 1 },
  ],
  gentleComparisonMessage:
    'R$ 45,50 a menos que no mês anterior. Cada dia conta e seu progresso é real.',
}

export const MOCK_CALENDAR_DAYS: Record<string, DayCalendarStatus> = {
  '2025-05-01': {
    date: '2025-05-01',
    status: 'limpo',
    label: 'Dia sereno e com caminhada no parque',
  },
  '2025-05-02': { date: '2025-05-02', status: 'limpo', label: 'Dia tranquilo, foco nas leituras' },
  '2025-05-03': {
    date: '2025-05-03',
    status: 'dificil',
    label: 'Sentiu vontade à noite, tomou chá e respirou fundo',
    notes: 'Ficou firme após 15 minutos.',
  },
  '2025-05-04': { date: '2025-05-04', status: 'limpo', label: 'Domingo com a família' },
  '2025-05-05': { date: '2025-05-05', status: 'reducao', label: 'Meta de café mantida (1 xícara)' },
  '2025-05-06': { date: '2025-05-06', status: 'limpo', label: 'Dia limpo e descansado' },
  '2025-05-07': { date: '2025-05-07', status: 'limpo', label: 'Mais um dia de paz conquistado' },
  '2025-05-08': {
    date: '2025-05-08',
    status: 'dificil',
    label: 'Vontade após reunião estressante',
  },
  '2025-05-09': { date: '2025-05-09', status: 'limpo', label: 'Dia sem episódios' },
  '2025-05-10': {
    date: '2025-05-10',
    status: 'recaida',
    label: 'Episódio registrado sem julgamento',
    notes: 'Saiu com colegas. Registrou para aprender com o gatilho.',
    spentAmount: 85,
    consequences: ['Dor de cabeça matinal', 'Sono picado'],
  },
  '2025-05-11': { date: '2025-05-11', status: 'limpo', label: 'Recomeço com calma e acolhimento' },
  '2025-05-12': { date: '2025-05-12', status: 'limpo', label: 'Dia limpo' },
  '2025-05-13': { date: '2025-05-13', status: 'limpo', label: 'Dia limpo e hidratado' },
  '2025-05-14': {
    date: '2025-05-14',
    status: 'reducao',
    label: '2 xícaras de café no limite planejado',
  },
  '2025-05-15': { date: '2025-05-15', status: 'limpo', label: 'Hoje — você está no caminho certo' },
}

export const MOCK_MEDICATIONS: PrescribedMedication[] = [
  {
    id: 'med-1',
    name: 'Sertralina (prescrito pelo Dr. André)',
    doctorName: 'Dr. André (Psiquiatria)',
    scheduledTime: '08:00',
    takenToday: true,
    notes: 'Tomar com água após o café da manhã.',
  },
  {
    id: 'med-2',
    name: 'Melatonina (prescrita pela Dra. Clara)',
    doctorName: 'Dra. Clara (Clínica Geral)',
    scheduledTime: '22:00',
    takenToday: false,
    notes: '30 minutos antes de dormir, desligar as telas.',
  },
]

export const SUPPORT_ORGANIZATIONS: SupportOrganization[] = [
  {
    id: 'aa',
    name: 'Alcoólicos Anônimos (A.A.)',
    shortName: 'A.A.',
    description: 'Irmandade de pessoas que querem parar de beber. Reuniões presenciais e online.',
    url: 'https://www.aa.org.br/',
  },
  {
    id: 'na',
    name: 'Narcóticos Anônimos (N.A.)',
    shortName: 'N.A.',
    description: 'Para quem quer parar o uso de drogas. Reuniões gratuitas.',
    url: 'https://www.na.org.br/',
  },
  {
    id: 'al-anon',
    name: 'Al-Anon',
    shortName: 'Al-Anon',
    description: 'Para familiares e amigos de pessoas com problema com álcool.',
    url: 'https://al-anon.org.br/',
  },
  {
    id: 'nar-anon',
    name: 'Nar-Anon',
    shortName: 'Nar-Anon',
    description: 'Para familiares de pessoas com problema com drogas.',
    url: 'https://www.naranon.org.br/',
  },
  {
    id: 'caps-ad',
    name: 'CAPS AD',
    shortName: 'CAPS AD',
    description:
      'Serviço público gratuito de saúde mental e álcool/drogas. Procure a unidade do seu município.',
    url: 'https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps',
    emergencyBadge: 'Rede Pública SUS',
  },
  {
    id: 'amor-exigente',
    name: 'Amor-Exigente',
    shortName: 'Amor-Exigente',
    description: 'Apoio e orientação para famílias.',
    url: 'https://amorexigente.org/',
  },
  {
    id: 'cvv',
    name: 'CVV (Centro de Valorização da Vida)',
    shortName: 'CVV',
    description: 'Apoio emocional 24h, gratuito. Ligue 188 ou acesse o chat.',
    url: 'https://cvv.org.br/',
    phone: '188',
    phoneDisplay: 'Ligue 188 (Gratuito, 24h)',
    emergencyBadge: 'Emergência Emocional',
  },
]

export const MEDICATION_SCREENING_QUESTIONS: ScreenQuestion[] = [
  {
    id: 'q1',
    text: 'Sentiu que precisava de mais para o mesmo efeito?',
  },
  {
    id: 'q2',
    text: 'Tomou antes do horário planejado com o médico?',
  },
  {
    id: 'q3',
    text: 'Perdeu ou ficou sem a caixa antes da data prevista?',
  },
  {
    id: 'q4',
    text: 'Pediu receita a mais de um médico para a mesma medicação?',
  },
]

export const ONBOARDING_SUBSTANCES = [
  { id: 'alcool', label: 'Álcool', category: 'substancia', highRisk: true },
  { id: 'tabaco', label: 'Tabaco', category: 'substancia', highRisk: false },
  { id: 'cigarro', label: 'Cigarro', category: 'substancia', highRisk: false },
  { id: 'acucar', label: 'Açúcar', category: 'habito', highRisk: false },
  { id: 'energetico', label: 'Energético', category: 'habito', highRisk: false },
  { id: 'cafe', label: 'Café', category: 'habito', highRisk: false },
  { id: 'refrigerante', label: 'Refrigerante', category: 'habito', highRisk: false },
  { id: 'maconha', label: 'Maconha', category: 'substancia', highRisk: false },
  { id: 'cocaina', label: 'Cocaína', category: 'substancia', highRisk: false },
  { id: 'md', label: 'MD (MDMA / Ecstasy)', category: 'substancia', highRisk: false },
  { id: 'lsd', label: 'LSD', category: 'substancia', highRisk: false },
  {
    id: 'opioides',
    label: 'Opioides (remédio para dor forte)',
    category: 'remedio',
    highRisk: true,
  },
  { id: 'calmantes', label: 'Calmantes / Ansiolíticos', category: 'remedio', highRisk: true },
  { id: 'dormir', label: 'Remédio para dormir (hipnóticos)', category: 'remedio', highRisk: false },
  { id: 'estimulantes', label: 'Estimulantes com receita', category: 'remedio', highRisk: false },
  { id: 'outras', label: 'Outras substâncias', category: 'substancia', highRisk: false },
]

export const HABIT_SWAP_SUGGESTIONS = [
  {
    id: 'caminhada',
    title: 'Caminhar no parque ou na calçada',
    duration: '10 a 15 min',
    description: 'Mude de ambiente. Sentir o vento no rosto desacelera a mente na hora.',
    iconName: 'Footprints',
  },
  {
    id: 'agua',
    title: 'Beber um copo grande de água gelada',
    duration: '2 min',
    description: 'Dá um choque de atenção no corpo e ajuda a hidratar enquanto a onda passa.',
    iconName: 'Droplets',
  },
  {
    id: 'cha',
    title: 'Fazer um chá quentinho com calma',
    duration: '5 min',
    description: 'Camomila, erva-cidreira ou hortelã. Segure a caneca quente com as duas mãos.',
    iconName: 'Coffee',
  },
  {
    id: 'banho',
    title: 'Tomar um banho morno relaxante',
    duration: '10 min',
    description: 'Deixe a água cair nos ombros. É um ritual simples para recomeçar o dia.',
    iconName: 'Sparkles',
  },
  {
    id: 'ligar',
    title: 'Mandar uma mensagem ou ligar para alguém',
    duration: '5 a 10 min',
    description: 'Fale de qualquer assunto leve. Você não precisa passar por isso no silêncio.',
    iconName: 'Phone',
  },
  {
    id: 'exercicio',
    title: 'Exercício leve ou alongamento',
    duration: '7 min',
    description: 'Alongue as costas, gire os ombros ou faça 15 polichinelos para liberar energia.',
    iconName: 'Activity',
  },
]
