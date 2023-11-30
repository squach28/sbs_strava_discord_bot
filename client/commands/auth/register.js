// Command for registering a user's Strava account to the Discord bot
const { SlashCommandBuilder } = require('discord.js')
const { checkIfUserExists } = require('../../../handlers/userHandler')
require('dotenv').config()

// format URL to include Strava Client ID and redirect_uri
const formatUrl = (discordId) => {
    return `http://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.API_URL}/auth/exchangeToken?discord_id=${discordId}&approval_prompt=force&scope=activity:read_all`
}

// function to provide message to user to complete registration
const message = (url) => {
    return `Please use the following link to complete registration: ${url}`
}

const userAlreadyExistsMsg = 'You already completed registration!'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Provides the user a link to register their Strava account with the Discord bot'),
        async execute(interaction) {
            const user = interaction.user
            const discordId = user.id
            try {
                const res = await checkIfUserExists(discordId)
                if(res) {
                    await interaction.reply(userAlreadyExistsMsg)
                } else {
                    user.send(message(formatUrl(discordId)))
                    await interaction.reply('A link has been sent to you, please use the link to complete registration!')
                }
            } catch(e) {
                await interaction.reply('Something went wrong, please try again later.')
            }
        },
        async handle(user, _) {
            const discordId = user.id
            try {
                const res = await checkIfUserExists(discordId)
                if(res) {
                    await user.send(userAlreadyExistsMsg)
                } else {
                    await user.send(message(formatUrl(discordId)))
                }
            } catch(e) {
                await user.send('Something went wrong, please try again later.')
            }

        }
}            