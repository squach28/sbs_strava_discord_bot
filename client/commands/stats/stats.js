const { SlashCommandBuilder } = require('discord.js')
const { getStatsByDiscordId } = require('../../../handlers/statsHandler')
const MAX_CHARACTER_LENGTH = 42

const createStatsTable = (name, stats) => {
    const table = []
    table.push(`Stats for ${name} \n`)
    const divider = '-'.repeat(MAX_CHARACTER_LENGTH) + "\n"
    table.push(divider)
    for(let stat of stats) {
        table.push(`${stat.category} - ${stat.numOfActivities} activities, ${stat.distance} mi\n`)
        table.push(divider)
    }
    const totalDistance = stats.reduce((accum, item) => accum += item.distance, 0)
    const totalActivities = stats.reduce((accum, item) => accum += item.numOfActivities, 0)
    const summary = `Total Activities: **${totalActivities}**, Total Distance: **${totalDistance} mi**`
    table.push(summary)
    return table
}

module.exports = {
   data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Lets the user see their stats'),
    async execute(interaction) {
        const user = interaction.user
        const discordId = user.id 
        try {
            const stats = await getStatsByDiscordId(discordId)
            const statsTable = createStatsTable(user.username, stats)
            await interaction.reply(statsTable.join(''))
        } catch(e) {
            console.log(e);
            await interaction.reply('Something went wrong, please try again later.')
        }

    },
    async handle(user) {
        const discordId = user.id 
        try {
            const stats = await getStatsByDiscordId(discordId)
            const statsTable = createStatsTable(user.username, stats)
            await user.send(statsTable.join(''))
        } catch(e) {
            await user.send('Something went wrong, please try again later.')
        }

    }
}