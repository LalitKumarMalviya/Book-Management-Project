const mongoose = require('mongoose')

//------------------------------ userSchema --------------------------------\\

const userSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss'],
        true: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        min: 8,
        max: 15
    },

    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true }
    }

}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)