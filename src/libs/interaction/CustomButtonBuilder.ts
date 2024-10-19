import {
  ButtonBuilder,
  ButtonStyle,
  Client,
  ComponentType,
  InteractionButtonComponentData,
  LinkButtonComponentData,
} from 'discord.js'

import { ButtonInteractionExecute } from '@/libs/interaction'

type CustomButtonComponentData =
  | CustomInteractionButtonComponentData
  | CustomLinkButtonComponentData

interface CustomInteractionButtonComponentData
  extends Omit<InteractionButtonComponentData, 'type'> {
  execute?: ButtonInteractionExecute
  type?: ComponentType.Button
}

interface CustomLinkButtonComponentData
  extends Omit<LinkButtonComponentData, 'type'> {
  execute?: ButtonInteractionExecute
  type?: ComponentType.Button
}

export class CustomButtonBuilder extends ButtonBuilder {
  constructor(
    public client: Client,
    data: CustomButtonComponentData,
  ) {
    super(Object.assign({ type: ComponentType.Button }, data))
    if (data.style === ButtonStyle.Link || !data.execute) return this
    this.client.interactionExecute.set(data.customId, {
      componentType: ComponentType.Button,
      customId: data.customId,
      execute: data.execute,
    })
    this.execute = data.execute
  }

  public execute: ButtonInteractionExecute = async () => {}

  public setExecute(execute: ButtonInteractionExecute): this {
    this.execute = execute
    return this
  }
}
