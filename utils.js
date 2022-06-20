module.exports = {
    time (date) {
        let time = {}
        time.mm = `${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}` }`
        time.hh = `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}` }`
        return `${time.hh}:${time.mm}`
    }
}