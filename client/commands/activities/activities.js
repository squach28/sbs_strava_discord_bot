const { SlashCommandBuilder } = require('discord.js')
const { getActivitiesByDiscordId, getActivitiesByCategory } = require('../../../handlers/activitiesHandler')
const stravaActivities = require('./stravaActivities.json')
const { AsciiTable3, AlignmentEnum } = require('ascii-table3')

// TODO: create a way to make ascii tables that will translate into discord messages
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
            const categoryInfo = interaction.options._hoistedOptions.find(option => {
                if(option.name === 'category') {
                    return option 
                }
            })
            
            try {
                let activities
                if(categoryInfo !== undefined) {
                    activities = await getActivitiesByCategory(discordId, categoryInfo.value)
                } else {
                    activities = await getActivitiesByDiscordId(discordId)
                }
                await interaction.reply('activities')

            } catch(e) {
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
                    activities = await getActivitiesByCategory(discordId, category)
                } else {
                    activities = await getActivitiesByDiscordId(discordId)
                }
                const formattedActivities = activities.map(activity => {
                    const options = { month: 'short', day: 'numeric', year: 'numeric'}
                    const date = new Date(activity.start_date_local)
                    return [ activity.name, date.toLocaleDateString('en-us', options), activity.distance ]
                })
                const table = new AsciiTable3('Your activities')
                                .setHeading('Name', 'Date', 'Distance')
                                .setAlign(1, AlignmentEnum.CENTER)
                                .addRowMatrix(formattedActivities)
                await user.send(table.toString())
                
            } catch(e) {
                console.log(e)
                await user.send('Something went wrong, please try again later.')
            }
        },

}