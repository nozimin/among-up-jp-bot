module.exports = {
	data: {
        name: 'healthcheck',
        description: '応答確認用のコマンドです',
        options: [
          {
            type: 'STRING',
            name: 'language',
            description: 'どの言語で挨拶するか指定します',
            required: true,
            choices: [
              { name: 'English', value: 'en' },
              { name: 'Japanese', value: 'ja' }
            ],
          }
        ]
    },
	async execute(interaction) {
    let lang = interaction.options.getString('language')
		await interaction.reply({
      content: lang === 'en' ? 'Pong!' : 'ぽ〜ん（笑）',
      ephemeral: true
    });
	}
}
