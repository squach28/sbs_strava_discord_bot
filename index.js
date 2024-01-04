const { discordClient } = require('./client/discordClient.js')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    discordClient.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Successfully connected to Discord Bot');
    })
})



