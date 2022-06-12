const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const { AsyncNedb } = require('nedb-async')

module.exports = {
	data: {
    name: 'delete_lobby',
    description: 'ゲームロビーを削除します',
  },
	async execute(interaction) {
    // TODO: モデレーターばどのロビーも削除可能にしたい
    var lobbiesDB = new AsyncNedb({ filename: 'db/lobbies', autoload: true })

    let user_has_lobbies = await lobbiesDB.asyncFind({
      guild_id: interaction.guildId,
      lobby_owner_id: interaction.member.id,
      deleted: false,
    })

    if (user_has_lobbies.length === 0) return interaction.reply('削除可能なロビーがありません')

    const delete_lobby_select_row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('delete_lobby_select')
        .setPlaceholder('ゲームロビーを選択...')
        .addOptions(
          user_has_lobbies.map(lobby => {
            return {
              label: lobby.name,
              value: lobby._id
            }
          })
        )
    )

    interaction.reply({
      content: '削除するロビーを選択してください', components: [delete_lobby_select_row]
    })
    // 次アクションは customs/delete_lobby_select.js 参照
	}
}
