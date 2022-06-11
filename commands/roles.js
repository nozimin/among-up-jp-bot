const { kind_roles } = require('../services/kind_role_link.js')

module.exports = {
	data: {
    name: 'show_roles',
    description: '役割が設定されているロールを表示します',
  },
	async execute(interaction) {
    const Datastore = require('nedb')
    var rolesDB     = new Datastore({ filename: 'db/roles', autoload: true })

    rolesDB.find({ guild_id: interaction.guildId }, (_, roles_data) => {
      // 検索結果がなければ作成
      if (roles_data === null) return interaction.reply({ content: '未設定です' })

      content = kind_roles.map(kind => {
        let role_data = roles_data.filter(rd => rd.kind === kind.value)[0]
        let role_mention = role_data ? interaction.guild.roles.cache.get(role_data.role_id).toString() : '未設定'
        return `${kind.name}: ${role_mention}`
      }).join('\n')

      interaction.reply({ content: content })
    })
  }
}
