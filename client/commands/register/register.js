// Command for registering a user's Strava account to the Discord bot
const { SlashCommandBuilder } = require('discord.js')
const { checkIfUserExists, createUser, updateSessionId } = require('../../../handlers/userHandler')
const { v4 } = require('uuid')
require('dotenv').config()

// format URL to include Strava Client ID and redirect_uri
const formatUrl = (sessionId) => {
    return `http://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.API_URL}/auth/exchangeToken?state=${sessionId}&approval_prompt=force&scope=activity:read_all`
}

// function to provide message to user to complete registration
const message = (url) => {
    return `Please use the following link to complete registration: ${url}`
}

const createRegistrationSession = async (discordUser, interaction = null) => {
    try {
        const user = await checkIfUserExists(discordUser.id)
        const sessionId = v4()
        if(user) {
            if(user.sessionId) {
                await updateSessionId(discordUser.id)
                await discordUser.send(`Here's a new link to register: ${message(formatUrl(sessionId))}`)
                if(interaction) {
                    await interaction.reply('A new link to register has been sent to you')
                }
            } else {
                if(interaction) {
                    await interaction.reply(userAlreadyExistsMsg)
                } else {
                    await discordUser.send(userAlreadyExistsMsg)
                }

            }
        } else {
            await createUser(discordUser.id, discordUser.username, discordUser.avatar, sessionId)
            await discordUser.send(message(formatUrl(sessionId)))
            if(interaction) {
                await interaction.reply('A link has been sent to you, please use the link to complete registration!')
            }
        }
    } catch(e) {
        console.log(e)
        if(interaction) {
            await interaction.reply('Something went wrong, please try again later.')
        } else {
            await discordUser.send('Something went wrong, please try again later.')
        }
    }
}

const userAlreadyExistsMsg = 'You already completed registration!'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Provides the user a link to register their Strava account with the Discord bot'),
        async execute(interaction) {
            const discordUser = interaction.user
            await createRegistrationSession(discordUser, interaction)
        },
        async handle(discordUser, _) {
            await createRegistrationSession(discordUser)
        }
}            