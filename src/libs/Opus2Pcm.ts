// eslint-disable-next-line @typescript-eslint/no-require-imports
import { OpusEncoder } from '@discordjs/opus'
import { Transform } from 'stream'

export class Opus2Pcm extends Transform {
  private decoder: OpusEncoder
  constructor(sampleRate: number, channels: number) {
    super()

    this.decoder = new OpusEncoder(sampleRate, channels)
  }

  public _transform(
    chunk: Buffer,
    encoding: string,
    callback: () => void,
  ): void {
    const pcmData = this.decoder.decode(chunk)
    this.push(pcmData)
    callback()
  }
}
