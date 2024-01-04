// API handler for checking the leaderboard

const fetch = require('node-fetch')
const querystring = require('querystring')

// gets the leaderboard with params
// params: can be: (month_or_year), (month_or_year, year), or (year)
const getLeaderboard = async (params) => {
    try {
        const res = await fetch(`${process.env.API_URL}/leaderboard?` +
        querystring.stringify(params))
        const data = await res.json()
        return data 
    } catch(e) {
        console.log(`something went wrong ${e}`)
    }
}

module.exports = { getLeaderboard }