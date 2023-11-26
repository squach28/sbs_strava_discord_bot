const { SlashCommandBuilder } = require('discord.js')
require('dotenv').config()

const formatUrl = (discordId) => {
    return `http://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.URL}/auth/exchangeToken?discord_id=${discordId}&approval_prompt=force&scope=read`
}

const message = (url) => {
    return `Please use the following link to complete registration: ${url}`
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Provides the user a link to register their Strava account with the Discord bot'),
        async execute(interaction) {
            const user = interaction.user
            const discordId = user.id
            user.send(message(formatUrl(discordId)))
            await interaction.reply('A link has been sent to you, please use the link to complete registration!')
        },
        async handle(user) {
            const discordId = user.id
            await user.send(message(formatUrl(discordId)))
        }
}