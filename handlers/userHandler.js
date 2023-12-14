// API handler for user info

const fetch = require('node-fetch')

// checks if user with Discord ID exists
const checkIfUserExists = async (discordId) => {
    const res = await fetch(`${process.env.API_URL}/user/${discordId}`)
    if(res.status === 200) { // success, user found
        const user = await res.json()
        return user
    }
    return null 
}

// creates a user with discordId, discordname, avatarId, and sessionId
// avatarId is used to create avatarUrl, which stores a url to the discord user's avatar
// sessionId is used to determine whether the user has finished registration or not 
const createUser = async (discordId, discordName, avatarId, sessionId) => {
    const avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${avatarId}`
    const body = {
        discordId: discordId,
        discordName: discordName,
        avatarUrl: avatarUrl,
        sessionId: sessionId
    }
    const res = await fetch(`${process.env.API_URL}/user/createUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    return res
}

// updates a user's sessionId with a new one 
// used if the user didn't complete registration and tries to register again
const updateSessionId = async (discordId, sessionId) => {
    const res = await fetch(`${process.env.API_URL}/user/updateSessionId?discordId=${discordId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionId)
    })
    return res
}

module.exports = { checkIfUserExists, createUser, updateSessionId }