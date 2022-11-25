const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

//------------------------------ review Schema -------------------------------\\

const reviewSchema = new mongoose.Schema({

    bookId: {
        type: ObjectId,
        required: true,
        ref: 'Book',
        trim: true
    },

    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
        trim: true
    },

    reviewedAt: {
        type: Date,
        default: Date.now()
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5

    },

    review: {
        type: String,
        required: false,
        trim: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


module.exports = mongoose.model('Review', reviewSchema)