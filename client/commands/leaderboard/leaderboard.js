const { SlashCommandBuilder } = require('discord.js')
const { getMonthlyLeaderboard } = require('../../../handlers/leaderboardHandler.js')

const MAX_CHARACTER_LENGTH = 42

const createLeaderboardTable = (items) => {
    const table = []
    const title = `${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric'})} Leaderboard\n`
    const divider = '-'.repeat(MAX_CHARACTER_LENGTH) + "\n"
    table.push(title)
    table.push(divider)
    for(let i = 0; i < items.length; i++) {
        const numOfActivities = items[i].numOfActivities 
        const distance = items[i].distance 
        const discordId = items[i].discordId // TODO: replace this with name
        table.push(`${i + 1}. **${discordId}**, ${numOfActivities} activities, ${distance} mi \n`)
    }
    return table
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Get the leaderboard for this month or year'),
        async execute(interaction) {
            const user = interaction.user 
            try {
                const leaderboard = await getMonthlyLeaderboard()
                const table = createLeaderboardTable(leaderboard)
                const tableAsString = table.join('')
                await interaction.reply(tableAsString)
            } catch(e) {
                console.log(e)
                await interaction.reply('Something went wrong, please try again later.')
            }
        }
}