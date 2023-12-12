const { SlashCommandBuilder } = require('discord.js')
const { getLeaderboard } = require('../../../handlers/leaderboardHandler.js')
const timeframeChoices = require('./timeframe.json')

const MAX_CHARACTER_LENGTH = 42

const createLeaderboardTable = (items, month = null, year = null) => {
    const table = []
    let title
    if(month && year) {
        const date = new Date(year, month - 1) // subtract 1 from month to account that index starts at 0
        title = `${date.toLocaleString('en-US', { month: 'long', year: 'numeric'})} Leaderboard\n`
    } else if(year) {
        title = `${year} Leaderboard\n`
    } else {
        title = `${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric'})} Leaderboard\n`
    }
    const divider = '-'.repeat(MAX_CHARACTER_LENGTH) + "\n"
    table.push(title)
    table.push(divider)
    for(let i = 0; i < items.length; i++) {
        const numOfActivities = items[i].numOfActivities 
        const distance = items[i].distance 
        const discordId = items[i].discordId // TODO: replace this with name
        table.push(`${i + 1}. **${discordId}**, ${numOfActivities} activities, ${distance} mi \n`)
    }
    return table.join('')
}
// TODO: finish this function that both execute and handle can call instead of separately calling the same thing lol
const retrieveLeaderboard = async (params) => {
    const leaderboard = await getLeaderboard(params)
    return leaderboard
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription(`Get the leaderboard for a certain month or year`)
        .addStringOption(option => 
            option
                .setName('month_or_year')
                .setDescription('Enter the month or year you want to check')
                .setAutocomplete(true))
        .addStringOption(option => 
            option
                .setName('year')
                .setDescription('If you entered month, enter the year you want to check'))
        ,
        async autocomplete(interaction) {
            const focusedOption = interaction.options.getFocused(true)
            const choices = timeframeChoices
            const filtered = choices.filter(choice => choice.startsWith(focusedOption.value))
            await interaction.respond(filtered.map(choice => ({ name: choice, value: choice})))
        },
        async execute(interaction) {
            const params = {}
            const timeframeInfo = interaction.options._hoistedOptions.find(option => option.name === 'month_or_year' ? option : null)
            const timeframeYearInfo = interaction.options._hoistedOptions.find(option => option.name === 'year' ? option : null)
            if(timeframeYearInfo !== undefined) {
                params['year'] = timeframeYearInfo.value
            }
            if(timeframeInfo !== undefined) {
                params['monthOrYear'] = timeframeInfo.value
            }
            try {
                const leaderboard = await retrieveLeaderboard(params)
                if(leaderboard.length === 0) {
                    await interaction.reply(`No leaderboard`)
                } else {
                    let month, year 
                    if(params['monthOrYear'] && params['year']) {
                        month = leaderboard.month
                        year = leaderboard.year 
                    }
                    if(params['monthOrYear']) {
                        year = leaderboard.year
                    }
                    const leaderboardTable = createLeaderboardTable(leaderboard.users, month, year)
                    await interaction.reply(leaderboardTable)
                }

            } catch(e) {
                console.log(e)
                await interaction.reply('Something went wrong, please try again later.')
            }
        },
        async handle(user, commandParams) {
            const monthOrYearInfo = commandParams[0]
            const yearInfo = commandParams[1]
            const params = {}
            if(monthOrYearInfo && yearInfo) {
                params['monthOrYear'] = monthOrYearInfo 
                params['year'] = yearInfo
            }
            if(monthOrYearInfo) {
                params['monthOrYear'] = monthOrYearInfo
            }
            try {
                const leaderboard = await retrieveLeaderboard(params)

                let month, year
                if(params['monthOrYear'] && params['year']) {
                    month = leaderboard.month
                    year = leaderboard.year 
                }
                if(params['monthOrYear']) {
                    year = leaderboard.year
                }
                const leaderboardTable = createLeaderboardTable(leaderboard.users, month, year)
                await user.send(leaderboardTable)
            } catch(e) {
                console.log(e)
                await user.send('Something went wrong, please try again later.')
            }
        }
}