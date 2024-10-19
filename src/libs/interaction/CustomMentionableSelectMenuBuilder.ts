import {
  Client,
  ComponentType,
  MentionableSelectMenuBuilder,
  MentionableSelectMenuComponentData,
} from 'discord.js'

import { MentionableSelectMenuInteractionExecute } from '@/libs/interaction'

interface CustomMentionableSelectMenuComponentData
  extends Omit<MentionableSelectMenuComponentData, 'type'> {
  execute: MentionableSelectMenuInteractionExecute
  type?: ComponentType.MentionableSelect
}

export class CustomMentionableSelectMenuBuilder extends MentionableSelectMenuBuilder {
  constructor(
    public client: Client,
    data: CustomMentionableSelectMenuComponentData,
  ) {
    super(Object.assign({ type: ComponentType.MentionableSelect }, data))
    if (!data.execute) return this
    this.client.interactionExecute.set(data.customId, {
      componentType: ComponentType.MentionableSelect,
      customId: data.customId,
      execute: data.execute,
    })
    this.execute = data.execute
  }

  public execute: MentionableSelectMenuInteractionExecute = async () => {}

  public setExecute(execute: MentionableSelectMenuInteractionExecute): this {
    this.execute = execute
    return this
  }
}
