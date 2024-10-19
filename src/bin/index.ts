import { ClientOptions, Status } from 'discord.js'

import { deployCommands } from '@/commands'
import Client from '@/libs/Client'
import { ConnectionManager } from '@/libs/ConnectionManager'
import { VoskRecognizerStream } from '@/libs/VoskRecognizerStream'
import { env } from '@/utils'

const options: ClientOptions = {
  intents: [
    'Guilds',
    'GuildMessages',
    'GuildMembers',
    'GuildVoiceStates',
    'GuildIntegrations',
  ],
  waitGuildTimeout: 60000,
  rest: { timeout: 60000 },
}
const client = new Client(options)

client.on('interactionCreate', (interaction) => {
  void (async (): Promise<void> => {
    await interaction.client.interactionExecute.run(interaction)
  })()
})

client.on('ready', () => {
  void (async (): Promise<void> => {
    console.log('---deploy after login into Discord---')
    console.log('[1/1]deploy guild module...')
    await Promise.all(
      client.guilds.cache.map(async (guild) => {
        await guild.members.fetch()
        guild.connection = new ConnectionManager(guild)
        await deployCommands(guild)
      }),
    )

    await client.user?.edit({})
    // client.user?.setActivity(
    //   `BOTが正常に起動したよ！(Ver: ${packageJson.version})`,
    //   {
    //     type: ActivityType.Playing,
    //   },
    // )
    console.log('successfully launched!!')
  })()
})

process.on('unhandledRejection', (error: Error & { code?: string }) => {
  if (error.code === 'ECONNRESET') {
    console.error('The WebSocket encountered an error:', error)
    console.log('Attempting to reconnect...')
    reconnect()
  } else {
    throw error
  }
})

function reconnect(): void {
  if (client.ws.status === Status.Ready || client.ws.status === Status.Idle) {
    console.log('Client is already connected or idle, no need to reconnect.')
    return
  }

  setTimeout(() => {
    client
      .login(env.BOT_TOKEN)
      .then(() => {
        console.log('Successfully reconnected!')
      })
      .catch((err) => {
        console.error('Failed to reconnect:', err)
        console.log('Attempting to reconnect...')
        reconnect()
      })
  }, 5000)
}

async function start(): Promise<void> {
  console.log('---deploy before login into Discord---')
  console.log('[1/2]initialize...')
  await VoskRecognizerStream.init()

  console.log('[2/2]login Discord...')
  await client.login(env.BOT_TOKEN)
}
void start()
