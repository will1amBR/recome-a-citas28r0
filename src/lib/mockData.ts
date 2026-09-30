/**
 * Mock Data do Projeto Recomeça
 * Dados fictícios, humanizados e sem dados clínicos reais.
 * Frase-guia: "Um dia de cada vez. Recomeçar faz parte."
 */

export interface UserProfileIdentity {
  legalName?: string // Nome de registro, opcional
  preferredName?: string // Como gosta de ser chamada (nome usado no app)
  socialName?: string // Nome social, opcional
  genderIdentity?: string // mulher, homem, não-binário, trans, prefiro não dizer, outro
  genderCustomDescription?: string // Se selecionou trans, outro etc., descrição opcional
  sexualOrientation?: string // heterossexual, lésbica, gay, bissexual, pansexual, assexual, prefiro não dizer, outra
  orientationCustomDescription?: string // descrição opcional
}

export interface UserDailyHabitsRoutine {
  dayActivities: string[] // o que o dia tem: trabalho presencial, home office, estudo, cuidar da casa, filhos/família, momentos livres, etc.
  commonDayDescription?: string // Como é um dia comum (texto livre opcional)
  usagePeakTimes: string[] // Quando costuma usar: manhã, tarde, noite, madrugada
  whatHelpsToday: string[] // O que ajuda você hoje: caminhada, música/sons, tomar água, conversar, limpar a casa, etc.
  workStudyRoutine?: string // rotina de trabalho/estudo
  sleepRoutine?: string // rotina de sono (ex: durmo tarde, sono picado, durmo bem...)
  freeTimeRoutine?: string // momentos livres / fins de semana
}

export interface TrackedHabit {
  id: string
  name: string
  category: 'substancia' | 'bebida-estimulante' | 'remedio'
  substanceKey?: 'alcool' | 'tabaco' | 'cigarro' | 'cafe' | 'remedio' | string
  goalType: 'parar' | 'reduzir'
  currentStreakDays: number
  bestStreakDays: number
  cleanDaysThisMonth: number
  milestoneGoalDays: number
  dailyLimit?: number // ex: limite diário (cigarros, xícaras)
  dailyCurrent?: number
  unit?: string
  dailyGoalCustom?: string // Meta do dia livre editável pelo usuário (ex: "até 6 cigarros", "até 2 xícaras", "0 doses")
  startDate: string
  highRiskAbstinence?: boolean
  // Marcador diário específico para tabaco/cigarro
  cigarettesToday?: number
  cigarettesWeek?: number
  previousMonthPacks?: number
  thisMonthPacks?: number
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
  // Campos detalhados de consumo
  details?: SubstanceDetails
}

export interface DayCalendarStatus {
  date: string // YYYY-MM-DD
  status: 'limpo' | 'reducao' | 'recaida' | 'dificil'
  label: string
  notes?: string
  spentAmount?: number
  consequences?: string[]
}

export interface CravingTechniqueMetric {
  id: string
  name: string
  category: 'tecnica' | 'atividade'
  count: number
  passedWithoutUsingCount: number
  usedAfterCount: number
  percentagePassed: number
}

export interface GoodActionRecord {
  id: string
  title: string
  timestamp: string // HH:MM ou ISO
  type: 'tecnica' | 'atividade' | 'checkin' | 'honestidade' | 'meta-mantida' | 'tarefa-plano'
  message: string // ex: "Feito. Você escolheu você."
}

export type DayTaskCategory = 'casa' | 'corpo' | 'mente' | 'conexao'

export interface DailyScheduleTask {
  id: string
  title: string
  subtitle?: string
  category: DayTaskCategory
  dopamineRewardTip: string // Reforço de conexão da ação à dopamina/recompensa
  completedTodayMessage: string // ex: "Feito. A casa mais organizada, você mais leve."
  isPhysicalAlternativeToCravings?: boolean // parque, academia, caminhada, tarefas físicas
  isDefault?: boolean
}

export interface DayTaskCompletionLog {
  date: string // YYYY-MM-DD
  taskId: string
  taskTitle: string
  completedAt: string // HH:MM
}

export interface RiskSituationItem {
  id: string
  label: string
  description?: string
  suggestedActionIds?: string[]
}

export interface CigaretteLogItem {
  id: string
  timestamp: string // "HH:MM"
  date: string // "YYYY-MM-DD"
  quantity: number // default 1
  context: string // ex: "Depois do almoço", "Antes do jantar", etc.
  note?: string
}

export interface SubstanceDetails {
  // Quanto comprou: ex.: "1g", "3g", "5g", "1 pino", "meio maço", etc.
  boughtAmount?: string
  // Quanto usou: ex.: "0,5g", "1g", "3 latas", "2 doses"
  usedAmount?: string
  // Em quanto tempo usou: ex.: "em uma hora", "numa noite", "ao longo do dia", etc.
  usageDuration?: string
  // Dividiu com alguém?
  sharedWithOthers?: 'sim' | 'nao' | 'sozinho' | 'outro'
  // Detalhes de álcool
  alcoholType?: 'cerveja' | 'vinho' | 'destilado' | 'outro'
  alcoholUnits?: string // ex: "3 latas (350ml)", "2 taças", "1 dose (50ml)"
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
  cravingTechniquesEffectiveness: CravingTechniqueMetric[]
  gentleComparisonMessage: string
  // Dados de tabaco/cigarro no mês
  monthlyCigarettesTotal?: number
  monthlyPacksTotal?: number
  previousMonthPacksTotal?: number
  cigarettesComparisonMessage?: string
  // Métricas enriquecidas
  topCigaretteMoments?: { context: string; count: number; percentage: number }[]
  substanceUsageStats?: {
    substanceName: string
    totalEntries: number
    sharedCount: number
    typicalDuration: string
    typicalAmountBought?: string
  }[]
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

export const DEFAULT_USER_IDENTITY: UserProfileIdentity = {
  legalName: '',
  preferredName: 'Camila',
  socialName: '',
  genderIdentity: 'mulher',
  genderCustomDescription: '',
  sexualOrientation: 'bissexual',
  orientationCustomDescription: '',
}

export const DEFAULT_USER_DAILY_ROUTINE: UserDailyHabitsRoutine = {
  dayActivities: ['Trabalho em home office', 'Cuidar da casa', 'Momentos livres'],
  commonDayDescription:
    'Manhãs com café e computador, pausas para organizar a casa e noites para descansar.',
  usagePeakTimes: ['tarde', 'noite'],
  whatHelpsToday: [
    'Tomar água gelada',
    'Caminhada curta',
    'Ouvir sons suaves',
    'Arrumar um cantinho',
  ],
  workStudyRoutine: 'Home office em horário comercial com momentos de pressão',
  sleepRoutine: 'Costumo deitar por volta das 23h30',
  freeTimeRoutine: 'Fins de semana com família e passeios ao ar livre',
}

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
    substanceKey: 'alcool',
    goalType: 'parar',
    currentStreakDays: 19,
    bestStreakDays: 34,
    cleanDaysThisMonth: 23,
    milestoneGoalDays: 21,
    dailyGoalCustom: '0 doses (dia livre)',
    startDate: '2025-04-10',
    highRiskAbstinence: true,
  },
  {
    id: 'habit-cigarro',
    name: 'Cigarro',
    category: 'substancia',
    substanceKey: 'cigarro',
    goalType: 'reduzir',
    currentStreakDays: 5,
    bestStreakDays: 12,
    cleanDaysThisMonth: 19,
    milestoneGoalDays: 15,
    dailyLimit: 6, // Meta diária de até 6 cigarros
    dailyCurrent: 4, // Hoje fumou 4 cigarros
    dailyGoalCustom: 'até 6 cigarros',
    unit: 'cigarros',
    cigarettesToday: 4,
    cigarettesWeek: 26,
    previousMonthPacks: 14,
    thisMonthPacks: 9,
    startDate: '2025-04-18',
    highRiskAbstinence: false,
  },
  {
    id: 'habit-2',
    name: 'Café e Energético',
    category: 'bebida-estimulante',
    substanceKey: 'cafe',
    goalType: 'reduzir',
    currentStreakDays: 8,
    bestStreakDays: 14,
    cleanDaysThisMonth: 21,
    milestoneGoalDays: 30,
    dailyLimit: 2,
    dailyCurrent: 1,
    dailyGoalCustom: 'até 2 xícaras',
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
  cravingTechniquesEffectiveness: [
    {
      id: 'caminhada',
      name: 'Caminhada curta no parque ou na calçada',
      category: 'atividade',
      count: 9,
      passedWithoutUsingCount: 8,
      usedAfterCount: 1,
      percentagePassed: 89,
    },
    {
      id: 'regra-15-min',
      name: 'Regra dos 15 minutos (timer)',
      category: 'tecnica',
      count: 8,
      passedWithoutUsingCount: 7,
      usedAfterCount: 1,
      percentagePassed: 88,
    },
    {
      id: 'surfar-onda',
      name: 'Navegar na onda + Respiração',
      category: 'tecnica',
      count: 7,
      passedWithoutUsingCount: 6,
      usedAfterCount: 1,
      percentagePassed: 86,
    },
    {
      id: 'agua-gelada',
      name: 'Água gelada devagar',
      category: 'atividade',
      count: 6,
      passedWithoutUsingCount: 5,
      usedAfterCount: 1,
      percentagePassed: 83,
    },
    {
      id: 'halt',
      name: 'Checagem Fome-Raiva-Solitude-Cansaço',
      category: 'tecnica',
      count: 5,
      passedWithoutUsingCount: 4,
      usedAfterCount: 1,
      percentagePassed: 80,
    },
    {
      id: 'aterrissagem-54321',
      name: 'Aterrissagem 5-4-3-2-1',
      category: 'tecnica',
      count: 4,
      passedWithoutUsingCount: 4,
      usedAfterCount: 0,
      percentagePassed: 100,
    },
    {
      id: 'filme-ate-o-fim',
      name: 'Dar o play no filme até o fim',
      category: 'tecnica',
      count: 3,
      passedWithoutUsingCount: 3,
      usedAfterCount: 0,
      percentagePassed: 100,
    },
  ],
  gentleComparisonMessage:
    'R$ 45,50 a menos que no mês anterior. Cada dia conta e seu progresso é real.',
  monthlyCigarettesTotal: 180,
  monthlyPacksTotal: 9,
  previousMonthPacksTotal: 12,
  cigarettesComparisonMessage:
    '3 maços a menos que o mês passado. Cada cigarro que você não fumou conta.',
  topCigaretteMoments: [
    { context: 'Depois do almoço', count: 48, percentage: 27 },
    { context: 'Com café', count: 36, percentage: 20 },
    { context: 'Antes do jantar', count: 28, percentage: 16 },
    { context: 'Estresse / pausa do trabalho', count: 24, percentage: 13 },
    { context: 'Depois de comer', count: 22, percentage: 12 },
    { context: 'Outros momentos', count: 22, percentage: 12 },
  ],
  substanceUsageStats: [
    {
      substanceName: 'Álcool',
      totalEntries: 2,
      sharedCount: 2,
      typicalDuration: 'numa noite (3 a 4h)',
      typicalAmountBought: 'chopes no bar',
    },
    {
      substanceName: 'Cocaína',
      totalEntries: 1,
      sharedCount: 1,
      typicalDuration: 'numa noite',
      typicalAmountBought: '1g',
    },
  ],
}

// Contextos do dia a dia para o registro rápido de cigarro
export const CIGARETTE_CONTEXTS = [
  'Depois do almoço',
  'Antes do jantar',
  'Depois de comer',
  'Com café',
  'Com bebida',
  'Estresse',
  'Tédio',
  'Saindo de casa',
  'Conversa / social',
  'Acordando',
  'Antes de dormir',
  'Outro momento',
] as const

// Mock inicial de cigarros registrados hoje (para somar os 4 de hoje)
export const MOCK_TODAY_CIGARETTES: CigaretteLogItem[] = [
  {
    id: 'cig-1',
    date: new Date().toISOString().slice(0, 10),
    timestamp: '08:20',
    quantity: 1,
    context: 'Com café',
  },
  {
    id: 'cig-2',
    date: new Date().toISOString().slice(0, 10),
    timestamp: '13:15',
    quantity: 1,
    context: 'Depois do almoço',
  },
  {
    id: 'cig-3',
    date: new Date().toISOString().slice(0, 10),
    timestamp: '15:40',
    quantity: 1,
    context: 'Estresse',
  },
  {
    id: 'cig-4',
    date: new Date().toISOString().slice(0, 10),
    timestamp: '18:50',
    quantity: 1,
    context: 'Antes do jantar',
  },
]

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

export type ActivityTimeCategory = '2min' | '10min' | '30min'

export interface SwapActivityItem {
  id: string
  title: string
  category: ActivityTimeCategory
  durationLabel: string
  energy: 'pouca' | 'media' | 'alta'
  description: string
  iconName: string
}

export const SWAP_ACTIVITIES_BY_TIME: SwapActivityItem[] = [
  // 2 minutos
  {
    id: 'agua-gelada',
    title: 'Beber um copo de água gelada bem devagar',
    category: '2min',
    durationLabel: '2 minutos',
    energy: 'pouca',
    description:
      'Sinta a água descendo devagar pela garganta. O choque térmico traz a mente para o corpo.',
    iconName: 'Droplets',
  },
  {
    id: 'respirar-10',
    title: 'Respirar fundo 10 vezes soltando os ombros',
    category: '2min',
    durationLabel: '2 minutos',
    energy: 'pouca',
    description:
      'Puxe pelo nariz contando até 4, solte pela boca contando até 6. Deixe os ombros caírem.',
    iconName: 'Wind',
  },
  {
    id: 'olhar-janela',
    title: 'Olhar pela janela e notar o céu ou as árvores',
    category: '2min',
    durationLabel: '2 minutos',
    energy: 'pouca',
    description:
      'Tire os olhos das telas e do impulso. Procure três tons diferentes de cor lá fora.',
    iconName: 'Eye',
  },
  {
    id: 'lavar-rosto',
    title: 'Lavar o rosto e os pulsos com água fria',
    category: '2min',
    durationLabel: '2 minutos',
    energy: 'pouca',
    description: 'Abaixe o ritmo cardíaco ativando o reflexo vagal natural de calma.',
    iconName: 'Sparkles',
  },

  // 10 minutos
  {
    id: 'banho-morno',
    title: 'Tomar um banho morno e desacelerar',
    category: '10min',
    durationLabel: '10 minutos',
    energy: 'media',
    description:
      'Deixe a água cair nas costas e na nuca. É um ritual simples para virar a página do momento.',
    iconName: 'Sparkles',
  },
  {
    id: 'caminhada-curta',
    title: 'Caminhada curta pelo quarteirão',
    category: '10min',
    durationLabel: '10 a 15 min',
    energy: 'media',
    description:
      'Mude de cômodo e de rua. Sentir o vento no rosto quebra o circuito da fissura na hora.',
    iconName: 'Footprints',
  },
  {
    id: 'arrumar-espaco',
    title: 'Arrumar um cantinho pequeno (mesa ou gaveta)',
    category: '10min',
    durationLabel: '10 minutos',
    energy: 'media',
    description:
      'Colocar ordem em algo pequeno do mundo dá uma sensação imediata de clareza interna.',
    iconName: 'Sparkles',
  },
  {
    id: 'musica-alta-dancar',
    title: 'Colocar uma música favorita e dançar sozinho',
    category: '10min',
    durationLabel: '5 a 10 min',
    energy: 'alta',
    description: 'Bote os fones, aumente o som e mexa o corpo para gastar a adrenalina da vontade.',
    iconName: 'Music',
  },
  {
    id: 'cha-quentinho',
    title: 'Fazer um chá quentinho e segurar a caneca',
    category: '10min',
    durationLabel: '8 minutos',
    energy: 'pouca',
    description: 'Camomila, erva-cidreira ou hortelã. Sinta o calor da caneca com as duas mãos.',
    iconName: 'Coffee',
  },

  // 30 minutos ou mais
  {
    id: 'caminhada-parque',
    title: 'Passear no parque ou área verde',
    category: '30min',
    durationLabel: '30 a 45 min',
    energy: 'media',
    description:
      'O contato visual com a natureza diminui o cortisol e renova a perspectiva do dia.',
    iconName: 'Footprints',
  },
  {
    id: 'exercicio-completo',
    title: 'Exercício físico ou treino leve',
    category: '30min',
    durationLabel: '30 minutos',
    energy: 'alta',
    description:
      'Corrida, bicicleta, musculação ou yoga. Produz endorfina natural e alivia a inquietação.',
    iconName: 'Activity',
  },
  {
    id: 'ligar-amigo',
    title: 'Ligar para alguém de confiança e conversar',
    category: '30min',
    durationLabel: '20 a 30 min',
    energy: 'media',
    description:
      'Fale da rotina, dê risada ou conte como está sendo seu dia. Você não precisa carregar tudo só.',
    iconName: 'Phone',
  },
  {
    id: 'hobby-offline',
    title: 'Mergulhar em um hobby manual ou leitura',
    category: '30min',
    durationLabel: '30 minutos+',
    energy: 'pouca',
    description: 'Cozinhar uma receita gostosa, desenhar, cuidar das plantas ou ler um livro.',
    iconName: 'Sparkles',
  },
]

// Mantido para compatibilidade onde for importado
export const HABIT_SWAP_SUGGESTIONS = SWAP_ACTIVITIES_BY_TIME.slice(0, 6)

export interface CravingTechniqueProtocol {
  id: string
  title: string
  subtitle: string
  approach: string // TCC, DBT, Prevenção de Recaída
  timeLabel: string
  summary: string
  steps: {
    number: number
    title: string
    description: string
  }[]
  gentleReminder: string
  actionType?: 'respiracao' | 'timer' | 'halt' | '54321' | 'filme' | 'oposta'
}

export const CRAVING_PROTOCOLS: CravingTechniqueProtocol[] = [
  {
    id: 'navegar-onda',
    title: 'Navegar na onda (Urge Surfing)',
    subtitle: 'A vontade sobe, chega ao topo e desce',
    approach: 'Prevenção de Recaída / Mindfulness',
    timeLabel: '3 a 5 min',
    summary:
      'A fissura não cresce para sempre. Ela funciona exatamente como uma onda do mar: sobe, atinge o pico e se desfaz.',
    steps: [
      {
        number: 1,
        title: 'Note onde a onda está no seu corpo',
        description:
          'Feche os olhos ou baixe o olhar. Sinta onde a vontade mora agora: no peito, no estômago, na boca seca ou nas mãos inquietas.',
      },
      {
        number: 2,
        title: 'Não empurre a onda',
        description:
          'Tentar lutar contra o pensamento só dá mais força a ele. Diga mentalmente: "Estou sentindo uma onda de vontade. Está tudo bem, é só uma onda."',
      },
      {
        number: 3,
        title: 'Surfe respirando devagar',
        description:
          'Respire no ritmo 4 segundos dentro, 6 segundos fora. A cada expiração, imagine a crista da onda perdendo força e quebrando na praia.',
      },
      {
        number: 4,
        title: 'Observe ela diminuir',
        description:
          'Em poucos minutos o pico passa. Você não precisou fugir nem ceder — só ficou na prancha até a água se acalmar.',
      },
    ],
    gentleReminder: 'Você já passou por muitas ondas antes. Esta também vai se desfazer.',
    actionType: 'respiracao',
  },
  {
    id: 'regra-15-minutos',
    title: 'Regra dos 15 minutos',
    subtitle: 'Prometa esperar um pouquinho antes de decidir',
    approach: 'Terapia Cognitivo-Comportamental (TCC)',
    timeLabel: '15 minutos',
    summary:
      'Você não precisa dizer "nunca mais". Só diga: "Agora não. Vou esperar 15 minutos com o relógio e depois eu decido."',
    steps: [
      {
        number: 1,
        title: 'Faça um combinado honesto com você',
        description:
          'Diga a si mesmo: "Não estou proibido de nada. Estou apenas adiando por 15 minutos para meu cérebro sair do piloto automático."',
      },
      {
        number: 2,
        title: 'Inicie o contador',
        description:
          'Toque no timer abaixo e mude de cômodo ou ocupe as mãos com qualquer micro-atividade.',
      },
      {
        number: 3,
        title: 'Quando o timer tocar, você decide',
        description:
          'Se a onda ainda estiver alta, registre o que sentiu sem culpa ou dê mais 15 minutos de presente.',
      },
    ],
    gentleReminder:
      'Quando o timer acabar, você decide com liberdade. Se ainda quiser, registre o que sentiu.',
    actionType: 'timer',
  },
  {
    id: 'checagem-halt',
    title: 'Checagem Fome • Raiva • Solitude • Cansaço',
    subtitle: 'O protocolo HALT traduzido para a sua realidade',
    approach: 'Prevenção de Recaída',
    timeLabel: '2 minutos',
    summary:
      'Quase sempre o impulso de usar é o corpo pedindo outra coisa básica: comida, descanso, companhia ou calma.',
    steps: [
      {
        number: 1,
        title: 'Fome: Faz quanto tempo que você não come?',
        description:
          'Queda de açúcar no sangue simula ansiedade e fissura. Micro-ação: coma uma fruta, uma castanha ou beba um copo de água gelada.',
      },
      {
        number: 2,
        title: 'Raiva / Estresse: Alguma coisa te irritou agora?',
        description:
          'Uma mensagem, cobrança no trabalho ou discussão. Micro-ação: lave as mãos com água fria e respire fundo 5 vezes antes de responder a qualquer um.',
      },
      {
        number: 3,
        title: 'Solitude: Você está sozinho(a) há muito tempo?',
        description:
          'O silêncio às vezes pesa. Micro-ação: mande um áudio rápido para um amigo ou vá para a sala onde tem alguém por perto.',
      },
      {
        number: 4,
        title: 'Cansaço: Seu corpo está pedindo sono?',
        description:
          'Cérebro esgotado perde o freio inibitório. Micro-ação: deite 10 minutos sem telas, feche os olhos e deixe o corpo descansar.',
      },
    ],
    gentleReminder: 'Não era vício puro: quase sempre era uma necessidade básica pedindo cuidado.',
    actionType: 'halt',
  },
  {
    id: 'aterrissagem-54321',
    title: 'Aterrissagem 5-4-3-2-1',
    subtitle: 'Técnica de ancoragem sensorial no presente',
    approach: 'Terapia Dialética-Comportamental (DBT)',
    timeLabel: '3 minutos',
    summary:
      'A fissura puxa a mente para o passado ou para o futuro. Esta técnica ancora você de volta aqui e agora.',
    steps: [
      {
        number: 1,
        title: '5 coisas que você VÊ ao redor',
        description:
          'Olhe em volta e aponte mentalmente: a cor da parede, uma sombra, um objeto sobre a mesa, uma folha, seus sapatos.',
      },
      {
        number: 2,
        title: '4 coisas que você SENTE no corpo',
        description:
          'O peso dos pés no chão, o tecido da camisa nos ombros, o ar fresco entrando no nariz, o encosto da cadeira.',
      },
      {
        number: 3,
        title: '3 coisas que você OUVE',
        description:
          'O barulho de um carro ao longe, o zumbido da geladeira, o som da sua própria respiração.',
      },
      {
        number: 4,
        title: '2 coisas que você CHEIRA ou 1 que SABOREIA',
        description:
          'O cheiro do ambiente ou do sabonete; tome um gole de água ou note o gosto da sua boca.',
      },
    ],
    gentleReminder: 'Você está no presente, seguro(a) e com os dois pés no chão.',
    actionType: '54321',
  },
  {
    id: 'assistir-filme-fim',
    title: 'Dar o play no filme até o fim',
    subtitle: 'Imagine com honestidade o que acontece DEPOIS',
    approach: 'TCC e Terapia da Aceitação',
    timeLabel: '2 minutos',
    summary:
      'A fissura mente mostrando apenas os primeiros 5 minutos de alívio. Dê o play e assista o filme completo.',
    steps: [
      {
        number: 1,
        title: 'O começo que a mente promete',
        description:
          'Reconheça o pensamento: sim, o primeiro momento parece alívio ou distração. Tudo bem reconhecer.',
      },
      {
        number: 2,
        title: 'Avance o filme para 2 horas depois',
        description:
          'O efeito passando, o dinheiro que saiu da conta, a ressaca física ou mental começando a se instalar.',
      },
      {
        number: 3,
        title: 'Avance para amanhã de manhã',
        description:
          'O despertador tocando, o cansaço pesado, a frustração de ter que recomeçar a contagem do zero. Sem drama, com olhar neutro.',
      },
      {
        number: 4,
        title: 'Escolha o outro final do filme',
        description:
          'Imagine você acordando amanhã com a cabeça leve, orgulhoso(a) de ter vencido a noite. Não é descontar pontos. É só lembrar.',
      },
    ],
    gentleReminder: 'Não é descontar pontos nem se punir. É só lembrar do filme inteiro.',
    actionType: 'filme',
  },
  {
    id: 'acao-oposta',
    title: 'Ação Oposta (2 minutos)',
    subtitle: 'Faça o contrário do impulso automático',
    approach: 'Terapia Dialética-Comportamental (DBT)',
    timeLabel: '2 minutos',
    summary:
      'O impulso quer isolamento, ficar parado na mesma sala e remoer a vontade. Quebre o padrão em 120 segundos.',
    steps: [
      {
        number: 1,
        title: 'Levante agora da cadeira ou cama',
        description:
          'Mude a postura física imediatamente: fique em pé, endireite a coluna e dê 10 passos.',
      },
      {
        number: 2,
        title: 'Mude de ambiente',
        description:
          'Saia do cômodo onde você está. Vá até a cozinha, para o quintal, para a portaria ou dê a volta no quarteirão.',
      },
      {
        number: 3,
        title: 'Procure pessoas ou movimento',
        description:
          'Vá para onde tem gente ou abra a janela para ver a rua. O impulso enfraquece quando o cenário muda.',
      },
      {
        number: 4,
        title: 'Ocupe as mãos fisicamente',
        description:
          'Lave uma louça, descasque uma laranja, segure uma pedra de gelo ou escove os dentes.',
      },
    ],
    gentleReminder: 'Mudando o corpo e o lugar por 2 minutos, o cérebro recebe outra mensagem.',
    actionType: 'oposta',
  },
]

// =============================================================
// TAREFAS SAUDÁVEIS DO DIA (CRONOGRAMA / PLANO DO DIA)
// Conectadas à dopamina saudável, recompensa e sensação de ordem
// =============================================================
export const DEFAULT_DAILY_SCHEDULE_TASKS: DailyScheduleTask[] = [
  {
    id: 'task-louca',
    title: 'Lavar a louça da pia',
    subtitle: 'Água corrente e pia livre em 10 minutos',
    category: 'casa',
    dopamineRewardTip:
      'Dá preguiça no começo, mas a recompensa chega: pia limpa gera dopamina imediata e alivia a mente.',
    completedTodayMessage: 'Feito. A pia limpa, a cabeça leve. Você cuidou do seu espaço.',
    isPhysicalAlternativeToCravings: true,
    isDefault: true,
  },
  {
    id: 'task-piso',
    title: 'Varrer ou passar pano no chão',
    subtitle: 'Movimentar o corpo e deixar a casa fresca',
    category: 'casa',
    dopamineRewardTip:
      'O esforço físico curto gasta a adrenalina da ansiedade e o cheiro de casa limpa acalma.',
    completedTodayMessage: 'Feito. Chão limpo e passos firmes. Casa em ordem faz bem por dentro.',
    isPhysicalAlternativeToCravings: true,
    isDefault: true,
  },
  {
    id: 'task-cama',
    title: 'Arrumar a cama',
    subtitle: 'A primeira vitória simples do seu dia',
    category: 'casa',
    dopamineRewardTip:
      'Uma tarefa pequena que sinaliza para o cérebro que o dia começou com cuidado.',
    completedTodayMessage: 'Feito. Cama arrumada, noite garantida com conforto.',
    isPhysicalAlternativeToCravings: false,
    isDefault: true,
  },
  {
    id: 'task-roupa',
    title: 'Lavar roupa ou estender no varal',
    subtitle: 'Movimento prático para não deixar acumular',
    category: 'casa',
    dopamineRewardTip: 'Fazer o que estava pendente tira um peso invisível das suas costas.',
    completedTodayMessage: 'Feito. Roupa cuidada, menos uma preocupação no dia.',
    isPhysicalAlternativeToCravings: true,
    isDefault: true,
  },
  {
    id: 'task-banho',
    title: 'Tomar banho e arrumar-se com calma',
    subtitle: 'Trocar de roupa e sentir-se bem na própria pele',
    category: 'corpo',
    dopamineRewardTip:
      'Água no corpo reseta o sistema nervoso. Vestir uma roupa limpa renova a autoestima.',
    completedTodayMessage: 'Feito. Você cuidou do seu corpo e renovou as energias.',
    isPhysicalAlternativeToCravings: true,
    isDefault: true,
  },
  {
    id: 'task-parque',
    title: 'Caminhada ao ar livre ou ir ao parque',
    subtitle: 'Ver árvores, luz do sol e respirar ar fresco',
    category: 'corpo',
    dopamineRewardTip:
      'Excelente alternativa à vontade de ir ao bar: o parque oxigena, gasta a tensão e reseta a mente.',
    completedTodayMessage: 'Feito. O ar fresco limpou a mente e você esteve com você.',
    isPhysicalAlternativeToCravings: true,
    isDefault: true,
  },
  {
    id: 'task-academia',
    title: 'Academia ou exercício físico em casa',
    subtitle: '30 minutos de esforço saudável',
    category: 'corpo',
    dopamineRewardTip:
      'Exercício libera dopamina e endorfina reais — o melhor substituto biológico para a fissura.',
    completedTodayMessage: 'Feito. Corpo em movimento, dopamina saudável na veia.',
    isPhysicalAlternativeToCravings: true,
    isDefault: true,
  },
  {
    id: 'task-comida',
    title: 'Refeição ou lanche saudável',
    subtitle: 'Comer com calma, sem pular horários',
    category: 'corpo',
    dopamineRewardTip: 'Glicose estável reduz em até 70% o impulso de beber ou usar.',
    completedTodayMessage: 'Feito. Corpo nutrido não confunde fome com fissura.',
    isPhysicalAlternativeToCravings: false,
    isDefault: true,
  },
  {
    id: 'task-organizacao',
    title: '10 minutos organizando uma gaveta ou mesa',
    subtitle: 'Foco em um único cantinho',
    category: 'casa',
    dopamineRewardTip:
      'A ordem visual externa traz ordem interna. Sensação rápida de dever cumprido.',
    completedTodayMessage: 'Feito. Um cantinho em paz faz toda a diferença.',
    isPhysicalAlternativeToCravings: true,
    isDefault: true,
  },
  {
    id: 'task-ligar',
    title: 'Ligar ou mandar mensagem para alguém querido',
    subtitle: 'Trocar duas frases com quem torce por você',
    category: 'conexao',
    dopamineRewardTip: 'Conexão humana real quebra o isolamento que precede o bar ou a recaída.',
    completedTodayMessage: 'Feito. Conexão aquece e fortalece o seu recomeço.',
    isPhysicalAlternativeToCravings: false,
    isDefault: true,
  },
  {
    id: 'task-hidratacao',
    title: 'Beber 2 litros de água ao longo do dia',
    subtitle: 'Garrafinha sempre por perto',
    category: 'corpo',
    dopamineRewardTip: 'Hidratação mantém a clareza mental e ajuda o fígado a eliminar toxinas.',
    completedTodayMessage: 'Feito. Corpo hidratado, foco renovado.',
    isPhysicalAlternativeToCravings: false,
    isDefault: true,
  },
  {
    id: 'task-dormir',
    title: 'Desligar telas e ir para a cama no horário',
    subtitle: 'Dar ao cérebro o descanso que ele precisa',
    category: 'mente',
    dopamineRewardTip:
      'Boa noite de sono é o maior escudo biológico contra o estresse do dia seguinte.',
    completedTodayMessage: 'Feito. O dia terminou em paz. Amanhã é outro passo.',
    isPhysicalAlternativeToCravings: false,
    isDefault: true,
  },
]

// =============================================================
// SITUAÇÕES DE RISCO / GATILHOS FREQUENTES (ONBOARDING & TROCAR)
// =============================================================
export const DEFAULT_RISK_SITUATIONS: RiskSituationItem[] = [
  {
    id: 'risk-estresse',
    label: 'Estresse acumulado ou cansaço mental',
    description: 'Quando a mente está exausta e pede alívio rápido',
    suggestedActionIds: ['task-parque', 'task-academia', 'task-banho'],
  },
  {
    id: 'risk-pressao-trabalho',
    label: 'Pressão no trabalho ou cobranças',
    description: 'Prazos apertados, reuniões tensas ou metas difíceis',
    suggestedActionIds: ['task-academia', 'task-louca', 'task-parque'],
  },
  {
    id: 'risk-ansiedade',
    label: 'Ansiedade ou coração acelerado',
    description: 'Medo do futuro, sensação de sobrecarga',
    suggestedActionIds: ['task-piso', 'task-banho', 'task-parque'],
  },
  {
    id: 'risk-mudancas-novos-empregos',
    label: 'Mudanças e novos começos (novo emprego, rotina nova)',
    description: 'Como no exemplo do Diego: a novidade gera frio na barriga e puxa o velho hábito',
    suggestedActionIds: ['task-parque', 'task-academia', 'task-organizacao'],
  },
  {
    id: 'risk-brigas',
    label: 'Brigas, discussões ou conflitos com alguém',
    description: 'Raiva, mágoa ou vontade de fugir da conversa',
    suggestedActionIds: ['task-parque', 'task-banho', 'task-ligar'],
  },
  {
    id: 'risk-solidao',
    label: 'Solidão ou sensação de vazio',
    description: 'Casa em silêncio ou falta de companhia',
    suggestedActionIds: ['task-ligar', 'task-louca', 'task-parque'],
  },
  {
    id: 'risk-tedio',
    label: 'Tédio ou não saber o que fazer com o tempo',
    description: 'Horas vagas sem plano prévio',
    suggestedActionIds: ['task-louca', 'task-piso', 'task-academia'],
  },
  {
    id: 'risk-festas-happyhour',
    label: 'Festas, happy hours ou saídas com colegas',
    description: 'Ambiente social onde outros estão consumindo',
    suggestedActionIds: ['task-academia', 'task-banho', 'task-ligar'],
  },
]
