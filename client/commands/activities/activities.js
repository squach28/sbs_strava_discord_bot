const { SlashCommandBuilder } = require('discord.js')
const { getActivitiesByDiscordId } = require('../../../handlers/activitiesHandler')
const stravaActivities = require('./stravaActivities.json')
const MAX_CHARACTER_LENGTH = 42 // stores max character length for a single line in discord message

// creates an ASCII table for the user's activities with the user's username in the header
const createActivitiesTable = (name, items) => {
    const table = []
    const dateOptions = { month: 'short', year: 'numeric' }
    table.push(`${new Date().toLocaleDateString('en-US', dateOptions)} Activities for ${name} \n`)
    const divider = '-'.repeat(MAX_CHARACTER_LENGTH) + "\n"
    table.push(divider)
    for(let item of items) {
        table.push(Object.values(item).join(', ') + " mi" + "\n")
        table.push(divider)
    }
    const totalDistance = items.reduce((accum, item) => accum += item.distance, 0)
    const summary = `Total Activities: **${items.length}**, Total Distance: **${totalDistance} mi**`
    table.push(summary)
    return table.join('')
}

// call getActivitesByDiscordId in handler to call getActivitiesByDiscord API 
const getActivities = async (discordId, params) => {
    const activities = await getActivitiesByDiscordId(discordId, params)
    const formattedActivities = activities.map(activity => {
        const options = { month: 'short', day: 'numeric', year: 'numeric'}
        const date = new Date(activity.start_date_local)

        return {
            name: activity.name, 
            date: date.toLocaleDateString('en-us', options), 
            distance: activity.distance
        }
    })
    return formattedActivities
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activities')
        .setDescription('Gets your activities on Strava')
        .addStringOption(option => 
            option
                .setName('category')
                .setDescription('Select the sport category you want')
                .setAutocomplete(true)
        ),
        async autocomplete(interaction) {
            const focusedOption = interaction.options.getFocused(true)
            const choices = stravaActivities
            const filtered = choices.filter(choice => choice.startsWith(focusedOption.value))
            await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })))
        },
        async execute(interaction) {
            const user = interaction.user 
            const discordId = user.id
            const params = {} // params to filter activites based on category
            const categoryInfo = interaction.options._hoistedOptions.find(option => {
                if(option.name === 'category') {
                    return option 
                }
            })
            if(categoryInfo !== undefined) { // user provided a category in discord command 
                params['category'] = categoryInfo.value
            }
            try {
                const activities = await getActivities(discordId, params)
                // formats date to human readable date
                const activitiesTable = createActivitiesTable(interaction.user.username, activities)
                await interaction.reply(activitiesTable)

            } catch(e) {
                console.log(e)
                await interaction.reply('Something went wrong, please try again later.')
            }
        },
        async handle(user, commandParams) {
            const discordId = user.id
            if(commandParams.length > 1) {
                await user.send('Too many parameters provided, please provide one category')
                return 
            }
            // category that user may or may have not entered
            const category = {
                category: commandParams[0]
            }

            try { 
                const activities = await getActivities(discordId, category)
                const table = createActivitiesTable(user.username, activities)
                await user.send(table)
                
            } catch(e) {
                console.log(e)
                await user.send('Something went wrong, please try again later.')
            }
        },

}