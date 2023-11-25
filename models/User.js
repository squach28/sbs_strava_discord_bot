const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    discordId: String,
    stravaId: Number,
    stravaAccessToken: String,
    stravaRefreshToken: String,
    stravaTokenExpiresAt: Number,
})

const User = mongoose.model("User", UserSchema)

module.exports = User