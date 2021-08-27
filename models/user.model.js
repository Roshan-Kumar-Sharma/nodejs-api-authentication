const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { boolean } = require("joi");

const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: boolean,
        default: false,
    },
});

UserSchema.pre("save", async function (next) {
    try {
        console.log("called before saving user");
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        throw err;
    }
};

// UserSchema.post('save', async function (next){
//     try {
//         console.log('called after saving user')
//     }
//     catch (err) {
//         next(err)
//     }
// })

const User = mongoose.model("user", UserSchema);

module.exports = User;
