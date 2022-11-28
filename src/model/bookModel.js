const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

//------------------------------- bookSchema --------------------------------\\

const bookSchema = new mongoose.Schema({

    bookCover:{
        type: String    //.jpg formate link from cloud storage aws s3 bucket 
    },

    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    excerpt: {
        type: String,
        required: true,
        trim: true
    },

    userId: {
        type: ObjectId,
        required: true,
        ref: 'User',
        trim: true
    },

    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    subcategory: [{
        type: String,
        required: true,
        trim: true
    }],

    reviews: {
        type: Number,
        default: 0,
        trim: true
    },

    deletedAt: {
        date: Date
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    releasedAt: {
        date: Date
    },

}, { timestamps: true })


module.exports = mongoose.model('Book', bookSchema)