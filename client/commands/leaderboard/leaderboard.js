const { SlashCommandBuilder } = require('discord.js')
const { getMonthlyLeaderboard } = require('../../../handlers/leaderboardHandler.js')

const TIMEFRAME_CHOICES = ['month', 'year']
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
        .setDescription('Get the leaderboard for this month or year')
        .addStringOption(option => 
            option.setName('timeframe')
            .setDescription('Get leaderboard by month or year')
            .setAutocomplete(true))
        ,
        async autocomplete(interaction) {
            const focusedOption = interaction.options.getFocused(true)
            const choices = TIMEFRAME_CHOICES
            const filtered = choices.filter(choice => choice.startsWith(focusedOption.value))
            await interaction.respond(filtered.map(choice => ({ name: choice, value: choice})))
        },
        async execute(interaction) {
            const params = {}
            const timeframeInfo = interaction.options._hoistedOptions.find(option => {
                if(option.name === 'timeframe') {
                    return option
                }
            })
            try {
                let leaderboard
                if(timeframeInfo !== undefined) {
                    params['timeframe'] = timeframeInfo.value
                    leaderboard = await getMonthlyLeaderboard(params)
                } else {
                    leaderboard = await getMonthlyLeaderboard()
                }

                const table = createLeaderboardTable(leaderboard)
                const tableAsString = table.join('')
                await interaction.reply(tableAsString)
            } catch(e) {
                console.log(e)
                await interaction.reply('Something went wrong, please try again later.')
            }
        }
}