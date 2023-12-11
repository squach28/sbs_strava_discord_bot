const { SlashCommandBuilder } = require('discord.js')
const { getActivitiesByDiscordId } = require('../../../handlers/activitiesHandler')
const stravaActivities = require('./stravaActivities.json')
const MAX_CHARACTER_LENGTH = 42

// TODO: include person's name in the table
const createTable = (name, items) => {
    const table = []
    table.push(`Activities for ${name} \n`)
    const divider = '-'.repeat(MAX_CHARACTER_LENGTH) + "\n"
    table.push(divider)
    for(let item of items) {
        table.push(Object.values(item).join(', ') + " mi" + "\n")
        table.push(divider)
    }
    const totalDistance = items.reduce((accum, item) => accum += item.distance
    , 0)
    const summary = `Total Activities: **${items.length}**, Total Distance: **${totalDistance} mi**`
    table.push(summary)
    return table
}




module.exports = {
    data: new SlashCommandBuilder()
        .setName('activities')
        .setDescription('Gets your activities on Strava')
        .addStringOption(option => 
            option
                .setName('category')
                .setDescription('Which sport category do you want to select')
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
            const params = {}
            const categoryInfo = interaction.options._hoistedOptions.find(option => {
                if(option.name === 'category') {
                    return option 
                }
            })
            try {
                let activities
                if(categoryInfo !== undefined) {
                    params['category'] = categoryInfo.value
                    activities = await getActivitiesByDiscordId(discordId, params)
                } else {
                    activities = await getActivitiesByDiscordId(discordId)
                }
                const formattedActivities = activities.map(activity => {
                    const options = { month: 'short', day: 'numeric', year: 'numeric'}
                    const date = new Date(activity.start_date_local)

                    return {
                        name: activity.name, 
                        date: date.toLocaleDateString('en-us', options), 
                        distance: activity.distance
                    }
                })
                const table = createTable(interaction.user.username, formattedActivities)
                const tableAsString = table.join('')
                await interaction.reply(tableAsString)

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
            
            const category = commandParams[0]

            try {
                let activities;
                if(category !== undefined) {
                    activities = await getActivitiesByDiscordId(discordId, category)
                } else {
                    activities = await getActivitiesByDiscordId(discordId)
                }
                const formattedActivities = activities.map(activity => {
                    const options = { month: 'short', day: 'numeric', year: 'numeric'}
                    const date = new Date(activity.start_date_local)

                    return {
                        name: activity.name, 
                        date: date.toLocaleDateString('en-us', options), 
                        distance: activity.distance
                    }
                })
                const table = createTable(user.username, formattedActivities)
                const tableAsString = table.join('')
                await user.send(tableAsString)
                
            } catch(e) {
                console.log(e)
                await user.send('Something went wrong, please try again later.')
            }
        },

}