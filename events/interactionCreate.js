module.exports = {
    name: "interactionCreate",
    async run(interaction) {
        if (interaction.isCommand()) {
            const command = require ('../interactions/command.js')
            await command.run(interaction)
            return
        }

        if (interaction.isSelectMenu()) {
            const selectMenu = require ('../interactions/selectMenu.js')
            await selectMenu.run(interaction)
            return
        }
    }
}