require('dotenv').config();
const http = require('http')

http
  .createServer(function(request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Discord bot is active now \n')
  })
  .listen(3000)

if (process.env.DISCORD_BOT_TOKEN == undefined) {
  console.error('token is not set')
  process.exit(0)
}

require('./bot.js')
