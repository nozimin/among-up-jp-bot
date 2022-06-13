const { AsyncNedb } = require('nedb-async')

module.exports = {
	data: {
    name: 'delete_lobby_select'
  },
	async execute(interaction) {
    const lobbiesDB = new AsyncNedb({ filename: 'db/lobbies', autoload: true })
    const wait = require('node:timers/promises').setTimeout
    let lobby_id = interaction.values[0]
    // TODO: 実行したユーザが持っているかを検証したい
    let lobby = await lobbiesDB.asyncFindOne({
      _id: lobby_id,
      guild_id: interaction.guildId,
      lobby_owner_id: interaction.member.id,
      deleted: false
    })

    // チャンネル取得して削除
    category_channel = interaction.guild.channels.cache.get(lobby.category_id)
    if (category_channel === undefined || !category_channel.deletable) return await interaction.update({ content: '削除できませんでした', components: [] })

    category_channel.children.forEach(ch => {
      if (ch.isText()) ch.send(`このロビーは30秒後に ${interaction.member.toString()} によって削除されます`)
    })
    await interaction.deferUpdate()
    await wait(30000)
    category_channel.children.forEach(ch => {
      // TODO: テキストチャンネルはできればアーカイブという形で残したい
      ch.delete('deleted by lobby master.')
    })
    category_channel.delete('deleted by lobby master.')

    // lobbiesDBのアップデート
    lobbiesDB.update(
      { _id: lobby._id },
      { $set: { deleted: true } },
      (_, data) => data
    )
	}
}
