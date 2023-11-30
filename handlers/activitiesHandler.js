// API handler for checking a user's activities

const fetch = require('node-fetch')

const getActivitiesByDiscordId = async (discordId) => {
    try {
        const res = await fetch(`${process.env.API_URL}/user/activities?discordId=${discordId}`)
        const activities = await res.json()
        return activities 
    } catch(e) {
        console.log(`something went wrong ${e}`);
    }
}

const getActivitiesByCategory = async (discordId, category) => {
    try {
        const res = await fetch(`${process.env.API_URL}/user/activities?discordId=${discordId}&category=${category}`)
        const activities = await res.json()
        return activities 
    } catch(e) {
        console.log('something went wrong')
    }
}

module.exports = { getActivitiesByDiscordId, getActivitiesByCategory }