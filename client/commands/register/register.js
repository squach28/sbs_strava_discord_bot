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


const userAlreadyExistsMsg = 'You already completed registration!'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Provides the user a link to register their Strava account with the Discord bot'),
        async execute(interaction) {
            const discordUser = interaction.user
            const discordId = discordUser.id
            const avatarId = discordUser.avatar
            const discordName = discordUser.username
            const sessionId = v4()
            try {
                const user = await checkIfUserExists(discordId)
                if(user) {
                    if(user.sessionId) {
                        await updateSessionId(discordId, { sessionId: sessionId })
                        await discordUser.send(`Here's a new link to register: ${message(formatUrl(sessionId))}`)
                    } else {
                        await discordUser.send(userAlreadyExistsMsg)
                    }
                } else {
                    await createUser(discordId, discordName, avatarId, sessionId)
                    await discordUser.send(message(formatUrl(sessionId)))
                    await interaction.reply('A link has been sent to you, please use the link to complete registration!')
                }
            } catch(e) {
                console.log(e)
                await interaction.reply('Something went wrong, please try again later.')
            }
        },
        async handle(discordUser, _) {
            const discordId = discordUser.id
            const avatarId = discordUser.avatar
            const sessionId = v4()
            const discordName = discordUser.username
            try {
                const user = await checkIfUserExists(discordId)
                if(user) { // user exists in DB
                    if(user.sessionId) { // user never completed registration, send new link with new session id 
                        await updateSessionId(discordId, { sessionId: sessionId})
                        await discordUser.send(`Here's a new link to register: ${message(formatUrl(sessionId))}`)
                    } else {
                        await discordUser.send(userAlreadyExistsMsg)
                    }
                } else {
                    await createUser(discordId, discordName, avatarId, sessionId)
                    await discordUser.send(message(formatUrl(sessionId)))
                }
            } catch(e) {
                console.log(e)
                await discordUser.send('Something went wrong, please try again later.')
            }

        }
}            