const { SlashCommandBuilder } = require('discord.js')
const { getStatsByDiscordId } = require('../../../handlers/statsHandler')
const MAX_CHARACTER_LENGTH = 42

// creates an ASCII table of the user's stats
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
    return table.join('')
}

// gets user's stats, used for both server command + bot dm command
const getUserStats = async (user) => {
    const discordId = user.id
    try {
        const stats = await getStatsByDiscordId(discordId)
        if(stats.message) { // error occurred and object has a message
            return stats.message
        }
        const statsTable = createStatsTable(user.username, stats)
        return statsTable
    } catch(e) {
        console.log(e)
        return 'Something went wrong, please try again later.'
    }
}

module.exports = {
   data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Lets the user see their stats'),
    async execute(interaction) {
        const user = interaction.user
        const stats = await getUserStats(user)
        await interaction.reply(stats)
    },
    async handle(user) {
        const stats = await getUserStats(user)
        await user.send(stats)
    }
}