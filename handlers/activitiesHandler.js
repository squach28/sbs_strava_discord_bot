// API handler for checking a user's activities

const fetch = require('node-fetch')
const querystring = require('node:querystring')

// gets user's activities for the month by discord id
// params are in the form of { category: 'canoeing', timeframe: 'timeframeAsString'}
const getActivitiesByDiscordId = async (discordId, params) => {
    const currentDate = new Date()
    const before = new Date(currentDate.getMonth() + 1 <= 11 ? currentDate.getFullYear() : currentDate.getFullYear() + 1,( currentDate.getMonth() + 1) % 11, 1).getTime() / 1000
    const after = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() / 1000
    // puts before and after in query parameters to get activites for the month and prevent discord max character limit message
    params['before'] = before 
    params['after'] = after
    // delete category in params if user didn't provide one 
    if(params['category'] === undefined) {
        delete params.category
    }
    try {
        const res = await fetch(`${process.env.API_URL}/activities?discordId=${discordId}&`
        + querystring.stringify(params))
        const activities = await res.json()
        return activities 
    } catch(e) {
        console.log(`something went wrong ${e}`);
    }
}

module.exports = { getActivitiesByDiscordId }