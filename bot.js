const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`${client.user.tag}にログインしました！`)
})

client.on('message', message => {
  if (message.mentions.users.has(client.user.id)) {
    message.reply('呼びましたか？')
    return
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
