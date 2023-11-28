// API handler for checking user's stats

const fetch = require('node-fetch')

// gets user's activities by discord id
const getStatsByDiscordId = async (discordId) => {
    const res = await fetch(`${process.env.API_URL}/user/stats?discordId=${discordId}`)
    const data = await res.json()
    return data 
}

module.exports = { getStatsByDiscordId }