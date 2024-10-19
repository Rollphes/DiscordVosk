import {
  Client,
  ComponentType,
  RoleSelectMenuBuilder,
  RoleSelectMenuComponentData,
} from 'discord.js'

import { RoleSelectMenuInteractionExecute } from '@/libs/interaction'

interface CustomRoleSelectMenuComponentData
  extends Omit<RoleSelectMenuComponentData, 'type'> {
  execute: RoleSelectMenuInteractionExecute
  type?: ComponentType.RoleSelect
}

export class CustomRoleSelectMenuBuilder extends RoleSelectMenuBuilder {
  constructor(
    public client: Client,
    data: CustomRoleSelectMenuComponentData,
  ) {
    super(Object.assign({ type: ComponentType.RoleSelect }, data))
    if (!data.execute) return this
    this.client.interactionExecute.set(data.customId, {
      componentType: ComponentType.RoleSelect,
      customId: data.customId,
      execute: data.execute,
    })
    this.execute = data.execute
  }

  public execute: RoleSelectMenuInteractionExecute = async () => {}

  public setExecute(execute: RoleSelectMenuInteractionExecute): this {
    this.execute = execute
    return this
  }
}
