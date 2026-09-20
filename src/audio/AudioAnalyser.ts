/**
 * AudioAnalyser
 * Extracts frequency energy bands from Web Audio AnalyserNode with smoothing.
 */
export interface EnergyData {
  bass: number;     // 20Hz - 250Hz
  lowMid: number;   // 250Hz - 500Hz
  mid: number;      // 500Hz - 2000Hz
  high: number;     // 2000Hz - 16000Hz
  overall: number;  // RMS / Average
}

export class AudioAnalyser {
  private analyserNode: AnalyserNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private timeData: Uint8Array<ArrayBuffer> | null = null;

  // Smoothed energies
  private currentEnergy: EnergyData = { bass: 0, lowMid: 0, mid: 0, high: 0, overall: 0 };
  private readonly smoothing: number = 0.82;

  public init(context: AudioContext, sourceNode: AudioNode): AnalyserNode {
    this.analyserNode = context.createAnalyser();
    this.analyserNode.fftSize = 512;
    this.analyserNode.smoothingTimeConstant = 0.75;
    this.analyserNode.minDecibels = -90;
    this.analyserNode.maxDecibels = -10;

    sourceNode.connect(this.analyserNode);

    const bufferLength = this.analyserNode.frequencyBinCount;
    this.freqData = new Uint8Array(bufferLength);
    this.timeData = new Uint8Array(bufferLength);

    return this.analyserNode;
  }

  public update(): EnergyData {
    if (!this.analyserNode || !this.freqData) {
      return this.currentEnergy;
    }

    this.analyserNode.getByteFrequencyData(this.freqData);

    const binCount = this.freqData.length;
    // Nyquist is ~22050Hz, so each bin is ~22050 / 256 ≈ 86Hz
    const bassEnd = Math.floor(250 / 86);
    const lowMidEnd = Math.floor(500 / 86);
    const midEnd = Math.floor(2000 / 86);
    const highEnd = Math.floor(14000 / 86);

    const rawBass = this.getAverage(0, bassEnd) / 255;
    const rawLowMid = this.getAverage(bassEnd, lowMidEnd) / 255;
    const rawMid = this.getAverage(lowMidEnd, midEnd) / 255;
    const rawHigh = this.getAverage(midEnd, highEnd) / 255;
    const rawOverall = this.getAverage(0, binCount) / 255;

    // Apply exponential smoothing
    const s = this.smoothing;
    const inv = 1 - s;

    this.currentEnergy = {
      bass: this.currentEnergy.bass * s + rawBass * inv,
      lowMid: this.currentEnergy.lowMid * s + rawLowMid * inv,
      mid: this.currentEnergy.mid * s + rawMid * inv,
      high: this.currentEnergy.high * s + rawHigh * inv,
      overall: this.currentEnergy.overall * s + rawOverall * inv,
    };

    return this.currentEnergy;
  }

  public getEnergy(): EnergyData {
    return this.currentEnergy;
  }

  private getAverage(startBin: number, endBin: number): number {
    if (!this.freqData || startBin >= endBin) return 0;
    let sum = 0;
    const safeEnd = Math.min(endBin, this.freqData.length);
    for (let i = startBin; i < safeEnd; i++) {
      sum += this.freqData[i];
    }
    return sum / (safeEnd - startBin);
  }

  public disconnect(): void {
    if (this.analyserNode) {
      try {
        this.analyserNode.disconnect();
      } catch (_) {
        // ignore
      }
      this.analyserNode = null;
    }
  }
}
