// API handler for checking a user's activities

const fetch = require('node-fetch')
const querystring = require('node:querystring')

// gets user's activities by discord id
// params are in the form of { category: 'canoeing', timeframe: 'timeframeAsString'}
const getActivitiesByDiscordId = async (discordId, params = {}) => {
    try {
        const res = await fetch(`${process.env.API_URL}/user/activities?discordId=${discordId}&`
        + querystring.stringify(params))
        const activities = await res.json()
        return activities 
    } catch(e) {
        console.log(`something went wrong ${e}`);
    }
}

module.exports = { getActivitiesByDiscordId }