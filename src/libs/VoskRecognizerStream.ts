import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import { Writable } from 'stream'
import vosk, {
  GrammarRecognizerParam,
  Recognizer,
  SpeakerRecognizerParam,
  XOR,
} from 'vosk'

export class VoskRecognizerStream extends Writable {
  private static modelsDir = './vosk-models'
  private static sampleRate = 48000
  private static model: vosk.Model | undefined
  private recognizer: Recognizer<
    XOR<SpeakerRecognizerParam, Partial<GrammarRecognizerParam>>
  >

  constructor(options = {}) {
    super(options)
    if (!VoskRecognizerStream.model) {
      throw new Error(
        'Model is not initialized\nPlease run VoskRecognizerStream.init()',
      )
    }

    this.recognizer = new vosk.Recognizer({
      model: VoskRecognizerStream.model,
      sampleRate: VoskRecognizerStream.sampleRate,
    })
  }

  public static async init(): Promise<void> {
    const modelPaths = fs
      .readdirSync(VoskRecognizerStream.modelsDir)
      .filter((file) =>
        fs
          .statSync(path.join(VoskRecognizerStream.modelsDir, file))
          .isDirectory(),
      )
      .map((model) => path.join(VoskRecognizerStream.modelsDir, model))

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'modelPath',
        message: 'Select a Vosk model:',
        choices: modelPaths,
      },
    ])
    const modelPath = answers.modelPath as string

    if (!fs.existsSync(modelPath)) {
      throw new Error(
        `Please download the model from https://alphacephei.com/vosk/models and unpack as ${modelPath} in the current folder.`,
      )
    }
    vosk.setLogLevel(0)
    VoskRecognizerStream.model = new vosk.Model(modelPath)
  }

  public _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: () => void,
  ): void {
    if (this.recognizer.acceptWaveform(chunk)) {
      const result = this.recognizer.result()
      console.log('Recognized:', result)
    } else {
      const partialResult = this.recognizer.partialResult()
      console.log('Partial:', partialResult)
    }
    callback()
  }

  public _final(callback: () => void): void {
    if (!this.recognizer) throw new Error('Recognizer is not initialized')

    console.log(this.recognizer.finalResult())
    this.recognizer.free()
    callback()
  }
}
