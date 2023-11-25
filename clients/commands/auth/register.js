const { SlashCommandBuilder } = require('discord.js')
require('dotenv').config()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Provides the user a link to register their Strava account with the Discord bot'),
        async execute(interaction) {
            const user = interaction.user
            const discordId = user.id
            const url = `http://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/strava/exchange_token?discord_id=${discordId}&approval_prompt=force&scope=read`
            const msg = `Please use the following link to complete registration: ${url}`
            user.send(msg)
            await interaction.reply('A link has been sent to you, please use the link to complete registration!')
        }
}