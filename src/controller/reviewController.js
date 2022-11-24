const reviewModel = require("../model/reviewModel")
const bookModel = require('../model/bookModel')
const mongoose = require('mongoose')
const { isValid, isValidRating } = require("../validation/validation")

//-----------------------------------{ create reviews }----------------------------------------//

const createReviews = async function (req, res) {

    try {

        let data = req.body
        let bookId = req.params.bookId
        let { reviewedBy, rating, review } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'Please Enter Review data!' })
        }

        //----------------Book Id validation-----------------\\

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is must to fetch the data!' })
        }
        bookId = bookId.trim()
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is invalid!!' })
        }

        let findDataBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findDataBook) {
            return res.status(404).send({ status: false, message: 'Book Not Found!' })
        }

        //-----------------reviewedBy validation-----------------\\

        if (!reviewedBy === "") {
            return res.status(400).send({ status: false, message: 'reviewedBy is Empty!' })
        }
        reviewedBy = reviewedBy.trim()
        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: 'reviewedBy is invalid!' })
        }


        //--------------------rating validation--------------------\\

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: 'rating is Empty!!' })
        }
        if (!isValidRating(rating)) {
            return res.status(400).send({ status: false, message: 'rating is invalid!' })
        }

        //---------------------review validation---------------------\\

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: 'review is Empty!!' })
            }
        }

        let savedData = await reviewModel.create(data)

        res.status(201).send({ status: true, message: 'Success', data: savedData })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }

}


module.exports = { createReviews }