import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ComponentType,
  MentionableSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from 'discord.js'

import { CustomButtonBuilder } from '@/libs/interaction/CustomButtonBuilder'
import { CustomChannelSelectMenuBuilder } from '@/libs/interaction/CustomChannelSelectMenuBuilder'
import { CustomMentionableSelectMenuBuilder } from '@/libs/interaction/CustomMentionableSelectMenuBuilder'
import { CustomModalBuilder } from '@/libs/interaction/CustomModalBuilder'
import { CustomRoleSelectMenuBuilder } from '@/libs/interaction/CustomRoleSelectMenuBuilder'
import { CustomStringSelectMenuBuilder } from '@/libs/interaction/CustomStringSelectMenuBuilder'
import { CustomUserSelectMenuBuilder } from '@/libs/interaction/CustomUserSelectMenuBuilder'
import { InteractionExecute } from '@/libs/interaction/InteractionExecute'

export {
  CustomButtonBuilder,
  CustomStringSelectMenuBuilder,
  CustomUserSelectMenuBuilder,
  CustomRoleSelectMenuBuilder,
  CustomMentionableSelectMenuBuilder,
  CustomChannelSelectMenuBuilder,
  CustomModalBuilder,
  InteractionExecute,
}

export type StringSelectMenuInteractionExecute = (
  interaction: StringSelectMenuInteraction,
) => Promise<void>
interface StringSelectMenuInteractionExecuteData {
  componentType: ComponentType.StringSelect
  customId: string
  execute: StringSelectMenuInteractionExecute
}

export type UserSelectMenuInteractionExecute = (
  interaction: UserSelectMenuInteraction,
) => Promise<void>
interface UserSelectMenuInteractionExecuteData {
  componentType: ComponentType.UserSelect
  customId: string
  execute: UserSelectMenuInteractionExecute
}

export type RoleSelectMenuInteractionExecute = (
  interaction: RoleSelectMenuInteraction,
) => Promise<void>
interface RoleSelectMenuInteractionExecuteData {
  componentType: ComponentType.RoleSelect
  customId: string
  execute: RoleSelectMenuInteractionExecute
}

export type MentionableSelectMenuInteractionExecute = (
  interaction: MentionableSelectMenuInteraction,
) => Promise<void>
interface MentionableSelectMenuInteractionExecuteData {
  componentType: ComponentType.MentionableSelect
  customId: string
  execute: MentionableSelectMenuInteractionExecute
}

export type ChannelSelectMenuInteractionExecute = (
  interaction: ChannelSelectMenuInteraction,
) => Promise<void>
interface ChannelSelectMenuInteractionExecuteData {
  componentType: ComponentType.ChannelSelect
  customId: string
  execute: ChannelSelectMenuInteractionExecute
}

export type ButtonInteractionExecute = (
  interaction: ButtonInteraction,
) => Promise<void>
interface ButtonInteractionExecuteData {
  componentType: ComponentType.Button
  customId: string
  execute: ButtonInteractionExecute
}

export type ModalSubmitInteractionExecute = (
  interaction: ModalSubmitInteraction,
) => Promise<void>
interface ModalSubmitInteractionExecuteData {
  componentType: ComponentType.TextInput
  customId: string
  execute: ModalSubmitInteractionExecute
}

export type InteractionExecuteData =
  | StringSelectMenuInteractionExecuteData
  | UserSelectMenuInteractionExecuteData
  | RoleSelectMenuInteractionExecuteData
  | MentionableSelectMenuInteractionExecuteData
  | ChannelSelectMenuInteractionExecuteData
  | ButtonInteractionExecuteData
  | ModalSubmitInteractionExecuteData
