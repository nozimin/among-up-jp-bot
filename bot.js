const { Client, Intents } = require('discord.js')
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
})
const fs = require('fs')

// メッセージの
client.on('messageCreate', async message => {
  console.log(message.content)
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const commands = {}
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands[command.data.name] = command
}

client.once('ready', async () => {
  const data = []
  for (const commandName in commands) {
    data.push(commands[commandName].data)
  }
  const DEV_SERVER_ID = '687570470836764682'
  await client.application.commands.set(data, DEV_SERVER_ID)
  console.log(`${client.user.tag} I'm in`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return
  const command = commands[interaction.commandName]
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    })
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
