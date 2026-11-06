import { AmbientSoundId } from '../types';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentType: AmbientSoundId = 'none';
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;
  private isPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentSound(): AmbientSoundId {
    return this.currentType;
  }

  public stop() {
    this.isPlaying = false;
    this.activeNodes.forEach((node) => {
      if (typeof node === 'number') {
        window.clearInterval(node);
      } else if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
        try {
          (node as AudioScheduledSourceNode).stop();
        } catch (e) {
          // ignore already stopped nodes
        }
      } else if ('disconnect' in node) {
        try {
          node.disconnect();
        } catch (e) {
          // ignore
        }
      }
    });
    this.activeNodes = [];
    this.currentType = 'none';
  }

  public play(type: AmbientSoundId, volumeOverride?: number) {
    if (volumeOverride !== undefined) {
      this.setVolume(volumeOverride);
    }

    if (type === 'none') {
      this.stop();
      return;
    }

    // If already playing the same type, keep running
    if (this.currentType === type && this.isPlaying) {
      return;
    }

    this.stop();
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.currentType = type;
    this.isPlaying = true;

    switch (type) {
      case 'rain':
        this.startRainSound();
        break;
      case 'rpg':
        this.startRpgSound();
        break;
      case 'cyber':
        this.startCyberSound();
        break;
      case 'sands':
        this.startSandsSound();
        break;
      default:
        break;
    }
  }

  // 1. RAIN AMBIENT (Pink Noise + Low Pass + Droplets)
  private startRainSound() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.04; // scale down
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.masterGain);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);

    // Droplets interval
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = 1200 + Math.random() * 800;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.01 + Math.random() * 0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    }, 180);

    this.activeNodes.push(interval);
  }

  // 2. RPG AMBIENT SYNTH (Warm Pad Chords)
  private startRpgSound() {
    if (!this.ctx || !this.masterGain) return;

    // Chords progression (frequencies for Cmaj7, Am7, Fmaj7)
    const chordProgressions = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [110.00, 130.81, 164.81, 196.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [146.83, 174.61, 220.00, 261.63], // Dm7
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.ctx || !this.isPlaying || !this.masterGain) return;
      const freqs = chordProgressions[chordIndex];
      chordIndex = (chordIndex + 1) % chordProgressions.length;

      freqs.forEach((freq) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 2.0);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 5.5);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 5.8);
      });
    };

    playNextChord();
    const interval = window.setInterval(playNextChord, 5500);
    this.activeNodes.push(interval);
  }

  // 3. CYBER FUTURISTIC HUM (Sub Drone + LFO Sweep)
  private startCyberSound() {
    if (!this.ctx || !this.masterGain) return;

    // Sub drone oscillator
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    // LFO to modulate filter
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 0.2 Hz slow pulse
    lfoGain.gain.setValueAtTime(100, this.ctx.currentTime);

    lfo.connect(filter.frequency);
    subOsc.connect(filter);
    subGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    filter.connect(subGain);
    subGain.connect(this.masterGain);

    subOsc.start();
    lfo.start();

    this.activeNodes.push(subOsc, lfo, filter, subGain);
  }

  // 4. ARENAS DEL TIEMPO (Prince of Persia Mystical Sand Wind & Chimes)
  private startSandsSound() {
    if (!this.ctx || !this.masterGain) return;

    // Wind buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const windBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = windBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = windBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(3, this.ctx.currentTime);

    // Wind LFO modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    lfo.connect(windFilter.frequency);
    windSource.connect(windFilter);
    windFilter.connect(this.masterGain);

    windSource.start();
    lfo.start();

    this.activeNodes.push(windSource, lfo, windFilter);

    // Ancient Persian scale chimes (D4, Eb4, F#4, G4, A4, Bb4, C#5)
    const persianNotes = [293.66, 311.13, 369.99, 392.00, 440.00, 466.16, 554.37];

    const interval = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying || !this.masterGain) return;
      const freq = persianNotes[Math.floor(Math.random() * persianNotes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.3);
    }, 2800);

    this.activeNodes.push(interval);
  }
}

export const ambientAudioEngine = new AmbientAudioEngine();
