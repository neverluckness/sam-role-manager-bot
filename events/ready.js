module.exports = {
    name: "ready",
    async run() {
        console.log(`${utils.time(new Date, true)} › Authorized as ${client.user.tag}`)
    }
}