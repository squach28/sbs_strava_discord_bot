const { SlashCommandBuilder } = require('discord.js')
const fs = require('node:fs')
const path = require('path')

const file = fs.readFileSync(path.join(__dirname, 'help.md'), 'utf8')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('List of commands that the bot supports'),
        async execute(interaction) {
            await interaction.reply(file)
        },
        async handle(user, _) {
            user.send(file)
        }
}