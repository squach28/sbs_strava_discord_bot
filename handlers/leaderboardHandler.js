const fetch = require('node-fetch')

const getMonthlyLeaderboard = async () => {
    const res = await fetch(`${process.env.API_URL}/leaderboard/month`)
    const data = await res.json()
    return data 
}

module.exports = { getMonthlyLeaderboard }