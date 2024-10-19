import { OpusEncoder } from '@discordjs/opus'
import {
  DiscordGatewayAdapterCreator,
  EndBehaviorType,
  VoiceConnection,
} from '@discordjs/voice'
import { ChannelType, Guild, VoiceBasedChannel } from 'discord.js'

import { VoskRecognizerStream } from '@/libs/VoskRecognizerStream'

export class ConnectionManager extends VoiceConnection {
  private static selfDeaf = false
  private static selfMute = true

  private nowChannel: VoiceBasedChannel | undefined

  constructor(private readonly guild: Guild) {
    super(
      {
        group: 'speaker',
        channelId: null,
        guildId: guild.id,
        selfDeaf: ConnectionManager.selfDeaf,
        selfMute: ConnectionManager.selfMute,
      },
      {
        adapterCreator:
          guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        debug: true,
      },
    )

    // origin
    this.receiver.speaking.on('start', (userId) => {
      console.log(`User ${userId} started speaking`)
      const audio = this.receiver.subscribe(userId, {
        end: {
          behavior: EndBehaviorType.AfterSilence,
          duration: 100,
        },
      })
      console.log(`bitrate: ${this.channel?.bitrate}`)
      const voskRecognizerStream = new VoskRecognizerStream()

      const decoder = new OpusEncoder(48000, 2)

      audio.on('data', (packet) => {
        const chunk = packet as Buffer
        const pcmData = decoder.decode(chunk)

        const newChunk = Buffer.alloc(pcmData.length / 2)
        const volumeFactor = 1.0

        for (let i = 0; i < newChunk.length; i++) {
          const sample = (pcmData[i * 2] + pcmData[i * 2 + 1]) / 2
          newChunk[i] = Math.min(127, Math.max(-128, sample * volumeFactor))
        }

        voskRecognizerStream.write(newChunk)
      })
      audio.on('end', (): void => {
        console.log(`Stream from user ${userId} has ended`)
        voskRecognizerStream._final(() => {})
        audio.destroy()
      })
    })
  }

  public get channel(): VoiceBasedChannel | undefined {
    return this.nowChannel
  }

  public async join(channel: VoiceBasedChannel | string): Promise<this> {
    const channelId = typeof channel === 'string' ? channel : channel.id
    if (this.nowChannel?.id === channelId)
      throw new Error('ConnectionManager: Already connected')
    this.nowChannel = undefined

    const vsChannel = await this.guild.client.channels
      .fetch(channelId)
      .catch(() => {
        throw new Error('ConnectionManager: Channel not found')
      })
    if (!vsChannel) throw new Error('ConnectionManager: Channel not found')
    if (
      vsChannel.type !== ChannelType.GuildVoice &&
      vsChannel.type !== ChannelType.GuildStageVoice
    )
      throw new Error('ConnectionManager: Not a voice channel')
    this.nowChannel = vsChannel

    this.rejoin({
      channelId: this.nowChannel.id,
      selfDeaf: ConnectionManager.selfDeaf,
      selfMute: ConnectionManager.selfMute,
    })
    return this
  }

  public override disconnect(): boolean {
    if (this.nowChannel) this.nowChannel = undefined
    return super.disconnect()
  }

  public override destroy(): void {
    if (this.nowChannel) this.nowChannel = undefined
    return super.destroy()
  }
}
