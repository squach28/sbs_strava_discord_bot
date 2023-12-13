// Command for registering a user's Strava account to the Discord bot
const { SlashCommandBuilder } = require('discord.js')
const { checkIfUserExists, createUser } = require('../../../handlers/userHandler')
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

const saveUser = async (discordId, avatarId, sessionId) => {
    const res = await createUser(discordId, avatarId, sessionId)
    return res
}

const userAlreadyExistsMsg = 'You already completed registration!'
// TODO: add user to database with discordId and avatarUrl, but without accessToken, stravaId, and refreshTime
// after they complete authentication, update the fields
module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Provides the user a link to register their Strava account with the Discord bot'),
        async execute(interaction) {
            const user = interaction.user
            const discordId = user.id
            const avatarId = user.avatar
            const sessionId = v4()
            try {
                const userExists = await checkIfUserExists(discordId)
                if(userExists) { // TODO: user either already exists or hasn't completed registration, CHECK
                    await interaction.reply(userAlreadyExistsMsg)
                } else {
                    user.send(message(formatUrl(sessionId)))
                    await saveUser(discordId, avatarId, sessionId)
                    await interaction.reply('A link has been sent to you, please use the link to complete registration!')
                }
            } catch(e) {
                await interaction.reply('Something went wrong, please try again later.')
            }
        },
        async handle(discordUser, _) {
            const discordId = discordUser.id
            const avatarId = discordUser.avatar
            const sessionId = v4()
            try {
                const user = await checkIfUserExists(discordId)
                if(user) {
                    if(user.sessionId) {
                        await saveUser(discordId, avatarId, sessionId)
                        await discordUser.send(`Here's a new link to register: ${message(formatUrl(sessionId))}`)
                    } else {
                        await discordUser.send(userAlreadyExistsMsg)
                    }

                } else {
                    await saveUser(discordId, avatarId, sessionId)
                    await discordUser.send(message(formatUrl(sessionId)))
                }
            } catch(e) {
                console.log(e)
                await user.send('Something went wrong, please try again later.')
            }

        }
}            