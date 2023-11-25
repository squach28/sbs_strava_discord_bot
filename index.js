const express = require('express')
const app = express()
const { discordClient } = require('./clients/discordClient.js')
const mongoose = require('mongoose')
const stravaRoutes = require('./routes/stravaRoutes.js')

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.6dvxunc.mongodb.net/sbs-strava?retryWrites=true&w=majority`

app.use('/strava', stravaRoutes)

app.listen(process.env.PORT || 3000, async () => {
    console.log(`listening on ${process.env.PORT || 3000}`);
    await mongoose.connect(uri)
    await discordClient.login(process.env.DISCORD_TOKEN)
})


