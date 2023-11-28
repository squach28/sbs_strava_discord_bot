const { SlashCommandBuilder } = require('discord.js')
const { getStatsByDiscordId } = require('../../../handlers/statsHandler')

module.exports = {
   data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Lets the user see their stats'),
    async execute(interaction) {
        const user = interaction.user
        const discordId = user.id 
        try {
            const stats = await getStatsByDiscordId(discordId)
            await interaction.reply(stats.recent_run_totals.distance.toString())
        } catch(e) {
            console.log(e);
            await interaction.reply('Something went wrong, please try again later.')
        }

    },
    async handle(user) {
        const discordId = user.id 
        try {
            const stats = await getStatsByDiscordId(discordId)
            await user.send(stats.recent_run_totals.distance.toString())
        } catch(e) {
            await user.send('Something went wrong, please try again later.')
        }

    }
}