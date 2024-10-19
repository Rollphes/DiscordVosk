import { CustomApplicationCommandData } from '@/commands'
import { ConnectionManager } from '@/libs/ConnectionManager'
import { InteractionExecute } from '@/libs/interaction'

declare module 'discord.js' {
  export interface Client {
    commandList: CustomApplicationCommandData[]
    interactionExecute: InteractionExecute
  }
  export interface Guild {
    connection: ConnectionManager
  }
}
