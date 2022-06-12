const { kansenPermission, visitorPermission } = require('../services/permision_creator.js')

module.exports = {
	data: {
    name: 'create_lobby',
    description: 'ゲームロビーを作成します',
    options: [
      {
        name: 'lobby_name',
        type: 'STRING',
        description: 'ゲームロビー名 (例: 「初心者歓迎 skeldやります」)',
        required: true,
      }
    ]
  },
	async execute(interaction) {
    const Datastore = require('nedb')
    var lobbiesDB   = new Datastore({ filename: 'db/lobbies', autoload: true , timestampData: true })

    let lobby_name = interaction.options.getString('lobby_name')

    let kansen_permission = await kansenPermission(interaction.guildId)
    let visitor_permission = await visitorPermission(interaction.guildId)

    interaction.guild.channels.create(
      lobby_name,
      { type: "GUILD_CATEGORY" }
    ).then(category => {
      // ロール制御
      category.permissionOverwrites.set([ kansen_permission, visitor_permission ])
      // メインVC作成
      category.createChannel(
        'ゲーム中VC',
        { type: 'GUILD_VOICE', userLimit: 99 }
      ).then(vc => {
        // ゲームロビーセッション用に招待作成
        vc.createInvite({ maxAge: 0, reason: 'game lobby session' })
      })
      // 幽霊VC作成
      category.createChannel('待機&幽霊用VC', { type: 'GUILD_VOICE', userLimit: 99 })
      // テキストチャット作成
      category.createChannel(
        'ゲーム用チャット',
        { type: 'GUILD_TEXT', topic: `lobby_master_id: ${interaction.member.id}\nglhf:)` }
      ).then(text_channel => {
        // 作成完了メッセージ
        interaction.reply({
          content: [
            'ゲームロビーを作成しました',
            `ロビー名: \`${lobby_name}\``,
            `ロビーに移動: ${text_channel.toString()}`
          ].join('\n'),
          ephemeral: true
        })
        // DB登録
        lobbiesDB.insert(
          {
            guild_id: interaction.guildId,
            category_id: category.id,
            name: lobby_name,
            lobby_owner_id: interaction.member.id,
            deleted: false
          }
        )
      })
    })
	}
}
