import { Transform } from 'stream'

class PCMConverter extends Transform {
  constructor(private byteRate: number) {
    super()
  }

  public _transform(
    chunk: Buffer,
    encoding: string,
    callback: () => void,
  ): void {
    const newChunk = Buffer.alloc(chunk.length / this.byteRate)
    for (let i = 0; i < newChunk.length; i++) {
      // 左右のチャンネルの平均を取る
      const leftSample = chunk.readIntLE(i * this.byteRate * 2, this.byteRate)
      const rightSample = chunk.readIntLE(
        i * this.byteRate * 2 + this.byteRate,
        this.byteRate,
      )
      const average = (leftSample + rightSample) / 2
      newChunk.writeIntLE(average, i * this.byteRate, this.byteRate)
    }
    this.push(newChunk)

    callback()
  }
}

export default PCMConverter
