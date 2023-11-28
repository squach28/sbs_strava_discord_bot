const { SlashCommandBuilder } = require('discord.js')
const { getActivitiesByDiscordId, getActivitiesByCategory } = require('../../../handlers/activitiesHandler')
const stravaActivities = require('./stravaActivities.json')
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
                console.log(activities)
                interaction.reply('activities')

            } catch(e) {
                interaction.reply('Something went wrong, please try again later.')
            }
        },
        async handle(user) {

        },

}