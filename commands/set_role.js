const { kind_roles } = require('../services/kind_role_link.js')

module.exports = {
	data: {
    name: 'set_role',
    description: 'bot上においてのロールの役割を設定します',
    options: [
      {
        name: 'role',
        type: 'ROLE',
        description: '対象のロール',
        required: true,
      },
      {
        name: 'kind',
        type: 'STRING',
        description: '対象ロールの役割',
        required: true,
        choices: kind_roles,
      }
    ]
  },
	async execute(interaction) {
    const Datastore = require('nedb')
    var rolesDB     = new Datastore({ filename: 'db/roles', autoload: true })

    let role = interaction.options.getRole('role')
    let kind = interaction.options.getString('kind')

    rolesDB.findOne({ guild_id: interaction.guildId, kind: kind }, (_, role_data) => {
      // 検索結果がなければ作成
      if (role_data === null) {
        return rolesDB.insert(
          {
            guild_id: interaction.guildId,
            role_id: role.id,
            kind: kind
          }
        )
      } else {
        // あれば更新
        return rolesDB.update(
          { _id: role_data._id },
          { $set: { role_id: role.id } },
          (_, updated_role_data) => updated_role_data
        )
      }
    })
    // レスポンス
    interaction.reply({
      content: [
        'ロール設定を更新しました',
        `${role.toString()} => \`${kind}\``
      ].join('\n'),
      ephemeral: true
    })
  }
}
