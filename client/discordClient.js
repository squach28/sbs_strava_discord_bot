// Discord Client
// Declares permimssions, registers commands, and registers event/command handling
require('dotenv').config()
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Channel
    ]
})

client.commands = new Collection() // references list of commands 

// read all the list of commands from commands folder
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    if(commandsPath.endsWith('.js')) continue // not a command folder, ignore deploy-commands.js file
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING]: The command at ${filePath} is missing a required "data" or "execute" property`);
        }
    
    
    }
}

// event handler for direct messaging
client.on('messageCreate', message => {
    if(message.guildId === null) { // no guild ID means DM
        const user = message.author
        if(message.content.startsWith('/')) { // check if user sent a command
            const commandName = message.content.split(' ')[0].split('/')[1]
            const commandParams = message.content.split(' ').slice(1)
            const command = client.commands.get(commandName)
            if(!command) {
                user.send(`No command matching ${commandName} was found.`)
                return
            }
            command.handle(user, commandParams)
        }
    }
})

// command handling in server
client.on(Events.InteractionCreate, async interaction => {
    if(interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName)
        try {
            await command.autocomplete(interaction)
        } catch(e) {
            console.log(e)
        }
    }
    if(!interaction.isChatInputCommand()) return 

    const command = interaction.client.commands.get(interaction.commandName)
    
    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return 
    }


    try {
        await command.execute(interaction)
    } catch(e) {
        console.error(e)
        if(interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command', ephemeral: true})
        } else {
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true})
        }
    }
})

client.once(Events.ClientReady, async (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
})



exports.discordClient = client


