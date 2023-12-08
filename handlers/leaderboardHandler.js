const fetch = require('node-fetch')
const querystring = require('querystring')

const getMonthlyLeaderboard = async (params = {}) => {
    try {
        const res = await fetch(`${process.env.API_URL}/leaderboard?` +
        querystring.stringify(params))
        const data = await res.json()
        return data 
    } catch(e) {
        console.log(`something went wrong ${e}`)
    }

}

module.exports = { getMonthlyLeaderboard }