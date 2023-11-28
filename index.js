const { discordClient } = require('./client/discordClient.js')

discordClient.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('Successfully connected to Discord Bot');
    })


