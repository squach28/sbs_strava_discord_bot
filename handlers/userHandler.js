// API handler for user info

const fetch = require('node-fetch')

// checks if user with Discord ID exists
const checkIfUserExists = async (discordId) => {
    const res = await fetch(`${process.env.API_URL}/user/${discordId}`)
    if(res.status === 200) { // success, user found
        return true
    }
    return false 
}

module.exports = { checkIfUserExists }