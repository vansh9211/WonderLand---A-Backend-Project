const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    // Only define fields not handled by passport-local-mongoose
    // passport-local-mongoose automatically handles 'username' and 'hash' (password)
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// CRITICAL: Attach passport-local-mongoose to the schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);