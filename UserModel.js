const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String
        },
        emailid: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            default: 0
        },
        bonus: {
            type: Number,
            default: 50
        },
        referalCode: {
            type: String,
            required: true
        },
        state:{
            type:String,
            required:true
        }
    },
    { timeseries: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
 