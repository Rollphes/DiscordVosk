import {
  ApplicationCommandData,
  ApplicationCommandType,
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  MessageContextMenuCommandInteraction,
  PermissionFlagsBits,
  UserContextMenuCommandInteraction,
} from 'discord.js'

type ExecuteTypes =
  | {
      type?: ApplicationCommandType.ChatInput
      execute: (
        interaction: ChatInputCommandInteraction<CacheType>,
      ) => Promise<void>
      autoComplete?: (
        interaction: AutocompleteInteraction<CacheType>,
      ) => Promise<void>
    }
  | {
      type: ApplicationCommandType.Message
      execute: (
        interaction: MessageContextMenuCommandInteraction<CacheType>,
      ) => Promise<void>
    }
  | {
      type: ApplicationCommandType.User
      execute: (
        interaction: UserContextMenuCommandInteraction<CacheType>,
      ) => Promise<void>
    }
interface ReplyConfig {
  /**
   * ephemeral?
   * @default false
   */
  ephemeral?: boolean
  /**
   * deferReply pre-execute?
   * @default true
   */
  deferReply?: boolean
}
export type CustomApplicationCommandData = ApplicationCommandData &
  ReplyConfig &
  ExecuteTypes

export const commandDatas: CustomApplicationCommandData[] = [
  {
    name: 'info',
    description: '開発者用コマンド',
    ephemeral: true,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    execute: async (interaction): Promise<void> => {
      const embed = new EmbedBuilder()
        .setTitle('Inside information on BOT')
        .setFields([
          {
            name: 'WebSocket-Ping',
            value: `${interaction.client.ws.ping}ms`,
            inline: true,
          },
          {
            name: 'DiscordAPI-latency',
            value: `${Date.now() - interaction.createdTimestamp}ms`,
            inline: true,
          },
          {
            name: 'cached DiscordUser Total',
            value: `${interaction.client.users.cache.size}users`,
            inline: true,
          },
          {
            name: 'cached DiscordChannel Total',
            value: `${interaction.client.channels.cache.size}channels`,
            inline: true,
          },
          {
            name: 'Heap Total',
            value: `${Math.round(
              process.memoryUsage().heapTotal / 1024 / 1024,
            )}MB`,
            inline: true,
          },
          {
            name: 'Heap Used',
            value: `${Math.round(
              process.memoryUsage().heapUsed / 1024 / 1024,
            )}MB`,
            inline: true,
          },
          {
            name: 'External',
            value: `${Math.round(
              process.memoryUsage().external / 1024 / 1024,
            )}MB`,
            inline: true,
          },
          {
            name: 'RSS',
            value: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
            inline: true,
          },
        ])
      await interaction.editReply({
        embeds: [embed],
      })
    },
  },
  {
    name: 'join',
    description: '動作テスト用コマンド',
    ephemeral: true,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    execute: async (interaction): Promise<void> => {
      if (!interaction.guild) return
      if (!interaction.member) return
      const channel = (interaction.member as GuildMember).voice.channel
      if (!channel) {
        await interaction.editReply({
          content: 'You must be in a voice channel to use this command.',
        })
        return
      }
      await interaction.guild.connection.join(channel)
      await interaction.editReply({
        content: 'Connected.',
      })
    },
  },
  {
    name: 'leave',
    description: '動作テスト用コマンド',
    ephemeral: true,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    execute: async (interaction): Promise<void> => {
      if (!interaction.guild) return
      if (!interaction.member) return
      const channel = (interaction.member as GuildMember).voice.channel
      if (!channel) {
        await interaction.editReply({
          content: 'You must be in a voice channel to use this command.',
        })
        return
      }
      if (channel.guild.connection.channel?.id !== channel.id) {
        await interaction.editReply({
          content: 'You must be in a same voice channel to use this command.',
        })
        return
      }
      interaction.guild.connection.disconnect()
      await interaction.editReply({
        content: 'Disconnected.',
      })
    },
  },
]

export async function deployCommands(guild: Guild): Promise<void> {
  await guild.commands.set(commandDatas)
}
