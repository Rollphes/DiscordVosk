import { Transform } from 'stream'

export class Pcm2Wav extends Transform {
  private readonly channels: number
  private readonly sampleRate: number
  private readonly bitRate: number
  private dataLength: number
  private dataBuffer: Buffer

  constructor(sampleRate: number, channels: number, bitRate: number) {
    super()
    this.sampleRate = sampleRate
    this.channels = channels
    this.bitRate = bitRate
    this.dataLength = 0
    this.dataBuffer = Buffer.alloc(0)
  }

  public _transform(
    chunk: Buffer,
    encoding: string,
    callback: () => void,
  ): void {
    this.dataBuffer = Buffer.concat([this.dataBuffer, chunk])
    this.dataLength += chunk.length
    callback()
  }

  public _flush(callback: () => void): void {
    const header = this._generateWavHeader()
    this.push(header)
    this.push(this.dataBuffer)
    callback()
  }

  private _generateWavHeader(): Buffer {
    const header = Buffer.alloc(44)

    // RIFF chunk descriptor
    header.write('RIFF', 0)
    header.writeUInt32LE(this.dataLength, 4)
    header.write('WAVE', 8)

    // fmt sub-chunk
    header.write('fmt ', 12)
    header.writeUInt8(16, 16) // Subchunk1Size (16 for PCM)
    header.writeUInt8(1, 20) // AudioFormat (1 for PCM)
    header.writeUInt8(this.channels, 22)
    header.writeUInt32LE(this.sampleRate, 24)
    header.writeUInt32LE(this.bitRate, 28)
    header.writeUInt8(2 * this.channels, 32)
    header.writeUInt8(16, 34)

    // data sub-chunk
    header.write('data', 36)
    header.writeUInt32LE(this.dataLength, 40)

    return header
  }
}
