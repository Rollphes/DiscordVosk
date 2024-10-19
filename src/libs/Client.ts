import { Client as OriginalClient, ClientOptions } from 'discord.js'

import { commandDatas } from '@/commands'
import { InteractionExecute } from '@/libs/interaction/InteractionExecute'

export default class Client extends OriginalClient {
  constructor(options: ClientOptions) {
    super(options)
    this.commandList = commandDatas
    this.interactionExecute = new InteractionExecute(this)
  }
}
