const { SlashCommandBuilder } = require('discord.js')
const { getLeaderboard } = require('../../../handlers/leaderboardHandler.js')
const monthChoices = require('./months.json')

const MAX_CHARACTER_LENGTH = 42

// creates an ASCII table for the leaderboard
const createLeaderboardTable = (leaderboard, includeMonth) => {
    if(leaderboard.message || leaderboard.users.length === 0) {
        return `No leaderboard`
    }
    const table = []
    let title // title depends on whether month needs to be included or not 
    if(includeMonth) {
        const date = new Date(leaderboard.year, leaderboard.month - 1) // subtract 1 from month to account that index starts at 0
        title = `${date.toLocaleString('en-US', { month: 'long', year: 'numeric'})} Leaderboard\n`
    } else {
        title = `${leaderboard.year} Leaderboard\n`
    }
    const divider = '-'.repeat(MAX_CHARACTER_LENGTH) + "\n"
    table.push(title)
    table.push(divider)
    const leaderboardUsers = leaderboard.users
    for(let i = 0; i < leaderboardUsers.length; i++) {
        const numOfActivities = leaderboardUsers[i].numOfActivities 
        const distance = leaderboardUsers[i].distance 
        const discordName = leaderboardUsers[i].discordName 
        table.push(`${i + 1}. **${discordName}**, ${numOfActivities} activities, ${distance} mi \n`)
    }
    return table.join('')
}

// gets the leaderboard based on params and returns an ASCII table of the leaderboard
const retrieveLeaderboard = async (params) => {
    try {
        const leaderboard = await getLeaderboard(params)
        if(leaderboard === null) {
            return 'No leaderboard exists'
        } else {
            const includeMonth = leaderboard.month === undefined ? false : true
            const leaderboardTable = createLeaderboardTable(leaderboard, includeMonth)
            return leaderboardTable
        }
    } catch(e) {
        console.log(e)
        return 'Something went wrong, please try again later.'
    }

    
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
            const choices = monthChoices
            const filtered = choices.filter(choice => choice.startsWith(focusedOption.value))
            await interaction.respond(filtered.map(choice => ({ name: choice, value: choice})))
        },
        async execute(interaction) {
            const params = {}
            const monthOrYearInfo = interaction.options._hoistedOptions.find(option => option.name === 'month_or_year' ? option : null)
            const yearInfo = interaction.options._hoistedOptions.find(option => option.name === 'year' ? option : null)
            if(monthOrYearInfo !== undefined) {
                params['year'] = monthOrYearInfo.value
            }
            if(yearInfo !== undefined) {
                params['monthOrYear'] = yearInfo.value
            }
            const leaderboard = await retrieveLeaderboard(params)
            await interaction.reply(leaderboard)

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
            const leaderboard = await retrieveLeaderboard(params)
            await user.send(leaderboard)
        }
}