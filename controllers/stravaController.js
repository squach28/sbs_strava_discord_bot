const fetch = require('node-fetch')
const querystring = require('node:querystring')
require('dotenv').config()
const User = require('../models/User')

const exchangeToken = async (req, res) => {
    const code = req.query.code
    const discordId = req.query.discord_id
    const authTokenUrl = 'https://www.strava.com/oauth/token?'

    await fetch(authTokenUrl + querystring.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
    }), { method: 'POST' })
        .then(result => result.json())
        .then(async data => {
            console.log(data)
            const userInfo = {
                discordId: discordId,
                stravaId: data.athlete.id,
                stravaAccessToken: data.access_token,
                stravaRefreshToken: data.refresh_token,
                stravaTokenExpiresAt: data.expires_at
            }
            const user = new User(userInfo)
            await user.save()

        })
    res.send('exchange token')
}

const getAccessToken = async (req, res) => {
    const stravaId = req.query.strava_id 
    const user = await User.findOne({ stravaId: stravaId})
    res.send(user.stravaAccessToken)
}

module.exports = { exchangeToken, getAccessToken}