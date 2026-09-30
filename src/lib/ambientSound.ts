/**
 * Gerador de áudio ambiente sintetizado via Web Audio API.
 * 100% offline, sem dependências externas, sem arquivos pesados, sem autoplay.
 *
 * Catálogo de Sons:
 * 1. Ruído Marrom (Brownian / Red Noise) -> ansiedade e pensamentos acelerados
 * 2. Ruído Branco (White Noise suave filtrado) -> mascarar barulhos e focar
 * 3. Ruído Rosa (Pink Noise) -> sono e descanso
 * 4. Som de Chuva (gotas sintetizadas + ruído filtrado constante) -> acalmar e ajudar a dormir
 * 5. Oceano & Baleias (ressonância harmônica de canto marinho + ondas suaves) -> acompanhar a respiração lenta
 * 6. Lo-Fi (harmonia suave de piano elétrico Rhodes / vinil quente) -> companhia para o tédio e o foco
 * 7. Frequências Suaves (drone binaural calmo em ondas alfa/theta ~432Hz/528Hz harmonizado) -> meditação e pausa
 */

export type SoundId = 'brown' | 'white' | 'pink' | 'rain' | 'ocean' | 'lofi' | 'drone'

export interface SoundDefinition {
  id: SoundId
  name: string
  subtitle: string
  bestFor: string
  shortLabel: string
  iconName: 'Waves' | 'Wind' | 'Sparkles' | 'CloudRain' | 'Fish' | 'Headphones' | 'Activity'
  description: string
  recommendedSituations: Array<
    'fissura-ansiedade' | 'respiracao' | 'noite-sono' | 'tedio-foco' | 'meditacao-pausa'
  >
}

export const SOUND_DEFINITIONS: Record<SoundId, SoundDefinition> = {
  brown: {
    id: 'brown',
    name: 'Ruído marrom',
    subtitle: 'Grave aveludado e contínuo',
    bestFor: 'Ansiedade e pensamentos acelerados',
    shortLabel: 'Para acalmar pensamentos',
    iconName: 'Wind',
    description:
      'Som profundo e constante com frequências graves quentes. Ajuda a desligar o turbilhão mental da crise.',
    recommendedSituations: ['fissura-ansiedade', 'noite-sono'],
  },
  white: {
    id: 'white',
    name: 'Ruído branco',
    subtitle: 'Estática suave e filtrada',
    bestFor: 'Mascarar barulhos e focar',
    shortLabel: 'Para mascarar ruídos',
    iconName: 'Sparkles',
    description:
      'Textura sonora balanceada e aveludada que silencia distrações ao redor e traz atenção ao presente.',
    recommendedSituations: ['tedio-foco'],
  },
  pink: {
    id: 'pink',
    name: 'Ruído rosa',
    subtitle: 'Frequência natural balanceada',
    bestFor: 'Sono e descanso',
    shortLabel: 'Para relaxar o corpo',
    iconName: 'Waves',
    description:
      'Mais suave que o ruído branco, em sintonia com os ritmos naturais do corpo e batimentos cardíacos.',
    recommendedSituations: ['noite-sono'],
  },
  rain: {
    id: 'rain',
    name: 'Som de chuva',
    subtitle: 'Pingos suaves e contínuos',
    bestFor: 'Acalmar e ajudar a dormir',
    shortLabel: 'Para acalmar e embalar',
    iconName: 'CloudRain',
    description:
      'Garoa reconfortante com pingos sutis sintetizados, trazendo sensação de aconchego e proteção.',
    recommendedSituations: ['respiracao', 'noite-sono'],
  },
  ocean: {
    id: 'ocean',
    name: 'Oceano & baleias',
    subtitle: 'Ondas rítmicas e canto calmo do mar',
    bestFor: 'Acompanhar a respiração lenta',
    shortLabel: 'Para respiração 4s/6s',
    iconName: 'Fish',
    description:
      'Maré lenta combinada com ressonâncias harmônicas marinhas. Perfeito para surfar a onda da fissura.',
    recommendedSituations: ['respiracao', 'fissura-ansiedade'],
  },
  lofi: {
    id: 'lofi',
    name: 'Lo-fi',
    subtitle: 'Acordes quentes e textura calma',
    bestFor: 'Companhia para o tédio e o foco',
    shortLabel: 'Para tédio e foco',
    iconName: 'Headphones',
    description:
      'Progressão lenta de acordes quentes inspirada em beats relaxantes de estudo, aliviando o vazio do dia.',
    recommendedSituations: ['tedio-foco'],
  },
  drone: {
    id: 'drone',
    name: 'Frequências suaves',
    subtitle: 'Drone meditativo harmonioso',
    bestFor: 'Meditação e pausa',
    shortLabel: 'Para meditação e pausa',
    iconName: 'Activity',
    description:
      'Ressonâncias puras e afinadas em frequência calma (tom fundamental com harmônicos suaves), sem sobressaltos.',
    recommendedSituations: ['respiracao', 'meditacao-pausa'],
  },
}

export const SOUND_LIST: SoundDefinition[] = [
  SOUND_DEFINITIONS.brown,
  SOUND_DEFINITIONS.ocean,
  SOUND_DEFINITIONS.rain,
  SOUND_DEFINITIONS.lofi,
  SOUND_DEFINITIONS.drone,
  SOUND_DEFINITIONS.pink,
  SOUND_DEFINITIONS.white,
]

const STORAGE_LAST_SOUND = 'recomeca_ambient_last_sound'
const STORAGE_VOLUME = 'recomeca_ambient_volume'

class AmbientSoundEngine {
  private audioCtx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private activeNodes: AudioNode[] = []
  private activeIntervals: Array<ReturnType<typeof setInterval>> = []
  private activeTimeouts: Array<ReturnType<typeof setTimeout>> = []
  private isPlaying: boolean = false
  private currentSoundId: SoundId = 'brown'
  private volume: number = 0.35 // 0.05 a 1.0 (padrão baixo e gentil)
  private listeners: Array<() => void> = []

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedSound = localStorage.getItem(STORAGE_LAST_SOUND) as SoundId | null
        if (savedSound && SOUND_DEFINITIONS[savedSound]) {
          this.currentSoundId = savedSound
        }
        const savedVol = localStorage.getItem(STORAGE_VOLUME)
        if (savedVol) {
          const parsed = parseFloat(savedVol)
          if (!Number.isNaN(parsed) && parsed >= 0.05 && parsed <= 1) {
            this.volume = parsed
          }
        }
      } catch {
        // localStorage indisponível
      }
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn()
      } catch {
        // ignora erro no listener
      }
    })
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioCtx = new AudioCtxClass()
      this.masterGain = this.audioCtx.createGain()
      this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime)
      this.masterGain.connect(this.audioCtx.destination)
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  private clearActiveGenerators() {
    this.activeIntervals.forEach((t) => clearInterval(t))
    this.activeIntervals = []

    this.activeTimeouts.forEach((t) => clearTimeout(t))
    this.activeTimeouts = []

    this.activeNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          ;(node as AudioScheduledSourceNode).stop()
        }
        node.disconnect()
      } catch {
        // nó já desconectado
      }
    })
    this.activeNodes = []
  }

  // Ruído Marrom (Brownian/Red Noise: integração com amortecimento, filtro passa-baixas quente)
  private buildBrownNoise(target: GainNode) {
    if (!this.audioCtx) return
    const bufferSize = this.audioCtx.sampleRate * 2
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = buffer.getChannelData(0)
    let lastOut = 0.0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      output[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = output[i]
      output[i] *= 2.4 // ganho compensatório
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(220, this.audioCtx.currentTime)

    source.connect(filter)
    filter.connect(target)
    source.start()
    this.activeNodes.push(source, filter)
  }

  // Ruído Branco Suave (filtrado para não incomodar os ouvidos, sem picos agressivos)
  private buildWhiteNoise(target: GainNode) {
    if (!this.audioCtx) return
    const bufferSize = this.audioCtx.sampleRate * 2
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.12
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Filtro suave para remover agudos sibilantes e manter textura confortável
    const lowpass = this.audioCtx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.setValueAtTime(1200, this.audioCtx.currentTime)

    const highpass = this.audioCtx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.setValueAtTime(160, this.audioCtx.currentTime)

    source.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(target)
    source.start()
    this.activeNodes.push(source, highpass, lowpass)
  }

  // Ruído Rosa (algoritmo clássico de Voss-McCartney com 1/f)
  private buildPinkNoise(target: GainNode) {
    if (!this.audioCtx) return
    const bufferSize = this.audioCtx.sampleRate * 2
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = buffer.getChannelData(0)
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08
      b6 = white * 0.115926
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime)

    source.connect(filter)
    filter.connect(target)
    source.start()
    this.activeNodes.push(source, filter)
  }

  // Som de Chuva: ruído rosa com modulação lenta + micro-gotas sintetizadas
  private buildRain(target: GainNode) {
    if (!this.audioCtx) return

    // Base contínua de água caindo (ruído rosa passa-faixa suave)
    const bufferSize = this.audioCtx.sampleRate * 2
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = buffer.getChannelData(0)
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07
      b6 = white * 0.115926
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const bandpass = this.audioCtx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.setValueAtTime(1400, this.audioCtx.currentTime)
    bandpass.Q.setValueAtTime(0.7, this.audioCtx.currentTime)

    // LFO sutil para rajada suave de vento na chuva
    const lfo = this.audioCtx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.2, this.audioCtx.currentTime)

    const lfoGain = this.audioCtx.createGain()
    lfoGain.gain.setValueAtTime(300, this.audioCtx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(bandpass.frequency)

    source.connect(bandpass)
    bandpass.connect(target)
    source.start()
    lfo.start()
    this.activeNodes.push(source, bandpass, lfo, lfoGain)

    // Gotas esporádicas suaves que caem no telhado/folhas
    const spawnDrop = () => {
      if (!this.audioCtx || !this.isPlaying || this.currentSoundId !== 'rain') return
      try {
        const dropOsc = this.audioCtx.createOscillator()
        const dropGain = this.audioCtx.createGain()
        const dropFilter = this.audioCtx.createBiquadFilter()

        const now = this.audioCtx.currentTime
        const baseFreq = 1600 + Math.random() * 800
        dropOsc.type = 'sine'
        dropOsc.frequency.setValueAtTime(baseFreq, now)
        dropOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.08)

        dropFilter.type = 'lowpass'
        dropFilter.frequency.setValueAtTime(2200, now)

        const dropVol = 0.03 + Math.random() * 0.04
        dropGain.gain.setValueAtTime(0.0001, now)
        dropGain.gain.linearRampToValueAtTime(dropVol, now + 0.01)
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09)

        dropOsc.connect(dropFilter)
        dropFilter.connect(dropGain)
        dropGain.connect(target)

        dropOsc.start(now)
        dropOsc.stop(now + 0.1)
      } catch {
        // ignora
      }
    }

    const rainDropInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        spawnDrop()
      }
      if (Math.random() > 0.6) {
        setTimeout(spawnDrop, 80 + Math.random() * 120)
      }
    }, 240)

    this.activeIntervals.push(rainDropInterval)
  }

  // Oceano e Baleias: fluxo de ondas rítmico (10s de respiração 4s/6s) + harmônicos de canto marinho
  private buildOcean(target: GainNode) {
    if (!this.audioCtx) return

    // Base de onda com ruído rosa filtrado e modulado
    const bufferSize = this.audioCtx.sampleRate * 2
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = buffer.getChannelData(0)
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08
      b6 = white * 0.115926
    }

    const source = this.audioCtx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    // Filtro de onda do mar com corte variável sincronizado com respiração (~10s ciclo: 0.1Hz)
    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(280, this.audioCtx.currentTime)

    const lfo = this.audioCtx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.1, this.audioCtx.currentTime) // ~10s ciclo de respiração

    const lfoGain = this.audioCtx.createGain()
    lfoGain.gain.setValueAtTime(140, this.audioCtx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)

    const waveGain = this.audioCtx.createGain()
    waveGain.gain.setValueAtTime(0.24, this.audioCtx.currentTime)

    source.connect(filter)
    filter.connect(waveGain)
    waveGain.connect(target)

    source.start()
    lfo.start()
    this.activeNodes.push(source, filter, lfo, lfoGain, waveGain)

    // Canto das baleias: glissando senoidal com reverberação sintética e harmônico
    const playWhaleCall = () => {
      if (!this.audioCtx || !this.isPlaying || this.currentSoundId !== 'ocean') return
      try {
        const now = this.audioCtx.currentTime
        const duration = 5.5 + Math.random() * 2

        const osc = this.audioCtx.createOscillator()
        const oscHarmonic = this.audioCtx.createOscillator()
        const callGain = this.audioCtx.createGain()
        const callFilter = this.audioCtx.createBiquadFilter()

        // Curva suave de frequência característica do canto marinho
        const base = 180 + Math.random() * 60
        const mid = base + 70 + Math.random() * 80
        const end = base - 25

        osc.type = 'sine'
        oscHarmonic.type = 'sine'

        osc.frequency.setValueAtTime(base, now)
        osc.frequency.linearRampToValueAtTime(mid, now + duration * 0.55)
        osc.frequency.exponentialRampToValueAtTime(Math.max(100, end), now + duration)

        // Harmônico uma oitava e quinta acima com vibrato leve
        oscHarmonic.frequency.setValueAtTime(base * 1.5, now)
        oscHarmonic.frequency.linearRampToValueAtTime(mid * 1.5, now + duration * 0.55)
        oscHarmonic.frequency.exponentialRampToValueAtTime(Math.max(150, end * 1.5), now + duration)

        // Filtro aveludado subaquático
        callFilter.type = 'lowpass'
        callFilter.frequency.setValueAtTime(480, now)

        callGain.gain.setValueAtTime(0.0001, now)
        callGain.gain.linearRampToValueAtTime(0.045, now + duration * 0.35)
        callGain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

        osc.connect(callFilter)
        oscHarmonic.connect(callFilter)
        callFilter.connect(callGain)
        callGain.connect(target)

        osc.start(now)
        oscHarmonic.start(now)
        osc.stop(now + duration + 0.2)
        oscHarmonic.stop(now + duration + 0.2)
      } catch {
        // ignora
      }
    }

    // Toca primeira baleia suave após 2 segundos, e depois a cada ~9 segundos
    const initialTimer = setTimeout(() => {
      playWhaleCall()
    }, 2000)
    this.activeTimeouts.push(initialTimer)

    const whaleInterval = setInterval(() => {
      playWhaleCall()
    }, 9500)
    this.activeIntervals.push(whaleInterval)
  }

  // Lo-Fi: progressão acolhedora de piano elétrico com ruído sutil de fita/vinil quente
  private buildLofi(target: GainNode) {
    if (!this.audioCtx) return

    // Ruído quente sutil de fita analógica (crackles esparsos + ruído filtrado bem baixo)
    const bufferSize = this.audioCtx.sampleRate * 2
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Crackle esparso analógico
      const crackle = Math.random() > 0.9992 ? (Math.random() * 2 - 1) * 0.15 : 0
      data[i] = (Math.random() * 2 - 1) * 0.015 + crackle
    }
    const tapeSource = this.audioCtx.createBufferSource()
    tapeSource.buffer = buffer
    tapeSource.loop = true

    const tapeFilter = this.audioCtx.createBiquadFilter()
    tapeFilter.type = 'lowpass'
    tapeFilter.frequency.setValueAtTime(900, this.audioCtx.currentTime)

    tapeSource.connect(tapeFilter)
    tapeFilter.connect(target)
    tapeSource.start()
    this.activeNodes.push(tapeSource, tapeFilter)

    // Acordes lo-fi nostálgicos com decaimento suave (estilo Rhodes/Wurlitzer com filtro morno)
    // Progressão: Dmaj9 -> Bm7 -> Em7 -> A7sus4 (clássica sensação de conforto)
    const chords = [
      [146.83, 220.0, 277.18, 329.63, 440.0], // Dmaj9
      [123.47, 185.0, 246.94, 293.66, 370.0], // Bm7
      [164.81, 196.0, 246.94, 329.63, 392.0], // Em7
      [110.0, 164.81, 220.0, 293.66, 329.63], // A7sus
    ]

    let chordIndex = 0

    const playLofiChord = (notes: number[]) => {
      if (!this.audioCtx || !this.isPlaying || this.currentSoundId !== 'lofi') return
      const now = this.audioCtx.currentTime
      const chordDuration = 5.2

      notes.forEach((freq, i) => {
        if (!this.audioCtx) return
        const osc1 = this.audioCtx.createOscillator()
        const osc2 = this.audioCtx.createOscillator()
        const noteGain = this.audioCtx.createGain()
        const noteFilter = this.audioCtx.createBiquadFilter()

        // Onda triangular + senoidal com desafinação bem leve (efeito fita lo-fi vintage)
        osc1.type = 'triangle'
        osc2.type = 'sine'
        const detune = (i % 2 === 0 ? 1 : -1) * 2.5
        osc1.frequency.setValueAtTime(freq, now)
        osc2.frequency.setValueAtTime(freq * 1.002, now)
        osc1.detune.setValueAtTime(detune, now)

        noteFilter.type = 'lowpass'
        noteFilter.frequency.setValueAtTime(550, now)

        noteGain.gain.setValueAtTime(0.0001, now)
        noteGain.gain.linearRampToValueAtTime(0.035, now + 0.35 + i * 0.04) // dedilhado suave
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration)

        osc1.connect(noteFilter)
        osc2.connect(noteFilter)
        noteFilter.connect(noteGain)
        noteGain.connect(target)

        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + chordDuration + 0.3)
        osc2.stop(now + chordDuration + 0.3)
      })
    }

    playLofiChord(chords[0])
    const lofiInterval = setInterval(() => {
      chordIndex = (chordIndex + 1) % chords.length
      playLofiChord(chords[chordIndex])
    }, 4800)
    this.activeIntervals.push(lofiInterval)
  }

  // Frequências Suaves: Drone meditativo contínuo afinado em tom calmante (432Hz fundamental + 528Hz harmônico)
  private buildDrone(target: GainNode) {
    if (!this.audioCtx) return

    // Raiz calmante: Lá a 108Hz (submúltiplo harmônico de 432Hz), com oitavas e quintas
    const frequencies = [
      { f: 108.0, type: 'sine' as OscillatorType, vol: 0.12, pan: 0 },
      { f: 162.0, type: 'sine' as OscillatorType, vol: 0.08, pan: -0.2 }, // quinta justa
      { f: 216.0, type: 'sine' as OscillatorType, vol: 0.06, pan: 0.2 }, // oitava
      { f: 270.0, type: 'triangle' as OscillatorType, vol: 0.04, pan: 0 }, // terça suave
      { f: 432.0, type: 'sine' as OscillatorType, vol: 0.025, pan: 0 }, // ressonância 432Hz
    ]

    frequencies.forEach((item) => {
      if (!this.audioCtx) return
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const filter = this.audioCtx.createBiquadFilter()

      osc.type = item.type
      osc.frequency.setValueAtTime(item.f, this.audioCtx.currentTime)

      // LFO sutil para batimento binaural calmo em ondas theta (~4Hz)
      const tremolo = this.audioCtx.createOscillator()
      tremolo.type = 'sine'
      tremolo.frequency.setValueAtTime(0.08 + Math.random() * 0.04, this.audioCtx.currentTime)
      const tremoloGain = this.audioCtx.createGain()
      tremoloGain.gain.setValueAtTime(item.vol * 0.3, this.audioCtx.currentTime)
      tremolo.connect(tremoloGain.gain)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime)

      gain.gain.setValueAtTime(item.vol, this.audioCtx.currentTime)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(target)

      osc.start()
      tremolo.start()
      this.activeNodes.push(osc, filter, gain, tremolo, tremoloGain)
    })
  }

  private startSelectedSound() {
    if (!this.audioCtx || !this.masterGain) return
    this.clearActiveGenerators()

    const soundTarget = this.audioCtx.createGain()
    soundTarget.gain.setValueAtTime(1.0, this.audioCtx.currentTime)
    soundTarget.connect(this.masterGain)
    this.activeNodes.push(soundTarget)

    switch (this.currentSoundId) {
      case 'brown':
        this.buildBrownNoise(soundTarget)
        break
      case 'white':
        this.buildWhiteNoise(soundTarget)
        break
      case 'pink':
        this.buildPinkNoise(soundTarget)
        break
      case 'rain':
        this.buildRain(soundTarget)
        break
      case 'ocean':
        this.buildOcean(soundTarget)
        break
      case 'lofi':
        this.buildLofi(soundTarget)
        break
      case 'drone':
        this.buildDrone(soundTarget)
        break
      default:
        this.buildBrownNoise(soundTarget)
    }
  }

  // Inicia ou troca de som com fade in/out suave e volume seguro
  public play(soundId?: SoundId) {
    try {
      this.initContext()
      if (!this.audioCtx || !this.masterGain) return

      if (soundId) {
        this.currentSoundId = soundId
        try {
          localStorage.setItem(STORAGE_LAST_SOUND, soundId)
        } catch {
          // ignora
        }
      }

      const now = this.audioCtx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value || 0.0001, now)

      this.startSelectedSound()

      // Fade-in suave de 1.4s até o volume atual configurado
      const targetGain = this.volume * 0.45 // ganho máximo calibrado para ser gentil e seguro
      this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 1.4)

      this.isPlaying = true
      this.notify()
    } catch {
      this.isPlaying = false
      this.notify()
    }
  }

  // Troca o som atual suavemente se já estiver tocando
  public switchSound(soundId: SoundId) {
    this.currentSoundId = soundId
    try {
      localStorage.setItem(STORAGE_LAST_SOUND, soundId)
    } catch {
      // ignora
    }
    if (this.isPlaying) {
      this.play(soundId)
    } else {
      this.notify()
    }
  }

  // Pausa com fade-out suave
  public pause() {
    if (!this.isPlaying) return

    if (this.audioCtx && this.masterGain) {
      const now = this.audioCtx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8)
    }

    const t = setTimeout(() => {
      this.clearActiveGenerators()
      this.isPlaying = false
      this.notify()
    }, 850)
    this.activeTimeouts.push(t)
  }

  // Alterna play/pause
  public toggle(soundId?: SoundId): boolean {
    if (this.isPlaying) {
      this.pause()
      return false
    } else {
      this.play(soundId || this.currentSoundId)
      return true
    }
  }

  // Ajusta volume (0.05 a 1.0) com persistência
  public setVolume(vol: number) {
    const clamped = Math.max(0.05, Math.min(1.0, vol))
    this.volume = clamped
    try {
      localStorage.setItem(STORAGE_VOLUME, clamped.toString())
    } catch {
      // ignora
    }

    if (this.audioCtx && this.masterGain && this.isPlaying) {
      const now = this.audioCtx.currentTime
      const targetGain = this.volume * 0.45
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.linearRampToValueAtTime(targetGain, now + 0.2)
    }
    this.notify()
  }

  public getVolume(): number {
    return this.volume
  }

  public getIsPlaying(): boolean {
    return this.isPlaying
  }

  public getCurrentSoundId(): SoundId {
    return this.currentSoundId
  }

  public getCurrentSound(): SoundDefinition {
    return SOUND_DEFINITIONS[this.currentSoundId] || SOUND_DEFINITIONS.brown
  }
}

// Instância compartilhada singleton
export const ambientAudio = new AmbientSoundEngine()
