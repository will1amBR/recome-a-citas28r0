/**
 * Gerador de áudio ambiente calmante / relaxante via Web Audio API.
 * Não requer arquivos externos pesados ou dependências externas;
 * funciona 100% offline em qualquer navegador moderno.
 *
 * Produz um som orgânico, quente e meditativo combinando:
 * - Acordes suaves pentatônicos em sintetizador senoidal/triangular com filtro passa-baixas
 * - Ruído rosa filtrado simulando ondas de respiração e vento suave
 * - Transições suaves de ganho (sem cliques)
 * - Volume baixo e seguro por padrão (respeitando interação do usuário, sem autoplay)
 */

class AmbientSoundEngine {
  private audioCtx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isPlaying: boolean = false
  private chordInterval: ReturnType<typeof setInterval> | null = null
  private pinkNoiseSource: AudioNode | null = null

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.audioCtx = new AudioCtxClass()
      this.masterGain = this.audioCtx.createGain()
      this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime)
      this.masterGain.connect(this.audioCtx.destination)
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  // Gera ruído rosa suave para simular ondas suaves e vento sutil
  private startGentleWaves() {
    if (!this.audioCtx || !this.masterGain) return

    const bufferSize = this.audioCtx.sampleRate * 2
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04
      b6 = white * 0.115926
    }

    const whiteNoise = this.audioCtx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    // Filtro suave passa-baixas para deixar aveludado (estilo onda do mar)
    const filter = this.audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(260, this.audioCtx.currentTime)

    // LFO para oscilar a onda sutilmente a cada 8-10 segundos
    const lfo = this.audioCtx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.1, this.audioCtx.currentTime) // 10 segundos por ciclo

    const lfoGain = this.audioCtx.createGain()
    lfoGain.gain.setValueAtTime(100, this.audioCtx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)

    const noiseGain = this.audioCtx.createGain()
    noiseGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime)

    whiteNoise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.masterGain)

    whiteNoise.start()
    lfo.start()
    this.pinkNoiseSource = whiteNoise
  }

  // Toca um acorde pentatônico suave com fade in e fade out longos
  private playSoftChord(freqs: number[], durationSec: number = 7) {
    if (!this.audioCtx || !this.masterGain) return
    const now = this.audioCtx.currentTime

    freqs.forEach((freq) => {
      if (!this.audioCtx || !this.masterGain) return
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const filter = this.audioCtx.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)

      // Filtro passa-baixas para remover agudos ásperos
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, now)

      // Envelope com ataque longo e decaimento sereno
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.linearRampToValueAtTime(0.05, now + 2.5) // fade in suave
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec) // fade out suave

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.masterGain)

      osc.start(now)
      osc.stop(now + durationSec + 0.5)
    })
  }

  public play() {
    if (this.isPlaying) return
    try {
      this.initContext()
      if (!this.audioCtx || !this.masterGain) return

      const now = this.audioCtx.currentTime
      // Fade in geral para o masterGain (volume máximo 0.22 — suave e acolhedor)
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value || 0.001, now)
      this.masterGain.gain.linearRampToValueAtTime(0.22, now + 1.5)

      this.startGentleWaves()

      // Sequência de acordes meditativos (Fá Maior 7 / Dó 9 / Sol / Lá menor - harmonia de relaxamento profundo)
      const chordProgression = [
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [130.81, 196.0, 261.63, 293.66], // C add9
        [146.83, 174.61, 220.0, 261.63], // Dm7
        [164.81, 196.0, 246.94, 293.66], // Em7
      ]

      let chordIndex = 0
      this.playSoftChord(chordProgression[0], 6.5)

      this.chordInterval = setInterval(() => {
        chordIndex = (chordIndex + 1) % chordProgression.length
        this.playSoftChord(chordProgression[chordIndex], 6.5)
      }, 5500)

      this.isPlaying = true
    } catch {
      // Fallback gracioso se o navegador bloquear áudio
      this.isPlaying = false
    }
  }

  public pause() {
    if (!this.isPlaying) return
    if (this.chordInterval) {
      clearInterval(this.chordInterval)
      this.chordInterval = null
    }

    if (this.audioCtx && this.masterGain) {
      const now = this.audioCtx.currentTime
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.0)
    }

    setTimeout(() => {
      this.isPlaying = false
    }, 1100)
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause()
      return false
    } else {
      this.play()
      return true
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying
  }
}

// Instância compartilhada singleton
export const ambientAudio = new AmbientSoundEngine()
