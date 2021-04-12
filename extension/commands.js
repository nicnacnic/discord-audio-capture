module.exports = (client, aliases, prefix, callback) => {
	if (typeof aliases === 'string') {
		aliases = [aliases]
	}

	client.on('message', (message) => {
		const { content } = message;

		aliases.forEach((alias) => {
			const command = `${prefix}${alias}`;

			if (content.startsWith(`${command} `) || content === command) {

				if (message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_CHANNELS')) {
					callback(message)
				}
				else {
					message.reply(`you do not have permission to execute this command!`)
				}
			}
		})
	})
}