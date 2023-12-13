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

const updateSessionId = async (discordId, sessionId) => {
    const res = await fetch(`${process.env.API_URL}/user/updateSessionId?discordId=${discordId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionId)
    })
}

module.exports = { checkIfUserExists, createUser, updateSessionId }