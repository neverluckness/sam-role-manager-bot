const os = require('node:os')

module.exports = {
    data: new builders.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Just a test command"),
    async run(interaction) {
        let _wsDelay = client.ws.ping
        let _lastDelays = []
        let _latency = Date.now() - interaction.createdTimestamp
        let _memory = await {
            total: Math.floor(os.totalmem() / 1024 / 1024),
            used: Math.floor((os.totalmem() - os.freemem()) / 1024 / 1024)
        }

        _memory.inPercentage = Math.floor(_memory.used / (_memory.total / 100))
        await interaction.deferReply()
        interaction.editReply({ embeds: [{
            title: "Pong!",
            description: `**Response Latency ›** \`${ _latency < 0 ? Math.abs(_latency) : _latency }ms\`\n**WebSocket ›** \`${_wsDelay}ms\`\n**Memory ›** \`${_memory.used}/${_memory.total}mb\` (\`${_memory.inPercentage}%\`)`
        }]})
    }
}