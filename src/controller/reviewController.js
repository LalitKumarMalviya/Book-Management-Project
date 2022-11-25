const reviewModel = require("../model/reviewModel")
const bookModel = require('../model/bookModel')
const mongoose = require('mongoose')
const { isValid, isValidRating } = require("../validation/validation")

//-----------------------------------{ create reviews }----------------------------------------//

const createReviews = async function (req, res) {

    try {

        let data = req.body
        let { bookId, reviewedBy, rating, review } = data

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

        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) {
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

//-----------------------------------{ update reviews }----------------------------------------//

const updateReview = async function (req, res) {

    try {

        let { bookId, reviewId } = req.params
        let data = req.body
        let { review, rating, reviewedBy } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'Please Enter data to update review!' })
        }

        //----------------Book Id validation-----------------\\

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is must to update the data!' })
        }
        bookId = bookId.trim()
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is invalid!!' })
        }

        //----------------review Id validation-----------------\\

        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, message: 'review Id is must to update the data!' })
        }
        reviewId = reviewId.trim()
        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: 'review Id is invalid!!' })
        }

        //---------------------------Db Call---------------------------\\

        //-1--Book Exist---
        let findBook = await bookModel.findOne({ bookId: bookId, isDeleted: false })
        if (!findBook) {
            return res.status(404).send({ status: false, message: 'Book Data Not Found!' })
        }

        //-2--Review Exist---
        let findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!findReview) {
            return res.status(404).send({ status: false, message: 'Review Data Not Found!' })
        }

        //-----------------reviewedBy validation-----------------\\

        if (reviewedBy || reviewedBy === "") {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: 'reviewedBy is Empty!' })
            }
        }

        //--------------------rating validation--------------------\\

        if (rating) {
            if (!isValidRating(rating)) {
                return res.status(400).send({ status: false, message: 'Rating is invalid!' })
            }
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: 'Rating should be in range of number 1 to 5' })
            }
        }

        //---------------------review validation---------------------\\

        if (review || review === "") {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: 'review is Empty!' })
            }
        }

        //--------------------------Db call-------------------------------\\

        let updatedReview = await reviewModel.findOneAndUpdate
            (
                { _id: reviewId, bookId: bookId, isDeleted: false },
                {
                    $set: {
                        reviewedBy: reviewedBy,
                        review: review,
                        rating: rating
                    }
                },
                { new: true }
            )

        let setData = findBook.toObject()
        setData.reviewData = updatedReview
        setData.reviews = 1

        res.status(200).send({ status: true, message: 'Books list', data: setData })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }

}

//-----------------------------------{ delete reviews }----------------------------------------//

const deleteReview = async function (req, res) {

    try {

        let { bookId, reviewId } = req.params

        //----------------Book Id validation-----------------\\

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is must to update the data!' })
        }
        bookId = bookId.trim()
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is invalid!!' })
        }

        //----------------review Id validation-----------------\\

        if (!isValid(reviewId)) {
            return res.status(400).send({ status: false, message: 'review Id is must to update the data!' })
        }
        reviewId = reviewId.trim()
        if (!mongoose.isValidObjectId(reviewId)) {
            return res.status(400).send({ status: false, message: 'review Id is invalid!!' })
        }

        //---------------------------Db Call---------------------------\\

        //-1--Book Exist---
        let findBook = await bookModel.findOne({ bookId: bookId, isDeleted: false })
        if (!findBook) {
            return res.status(404).send({ status: false, message: 'Book Data Not Found!' })
        }

        //-2--Review Exist---
        let findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!findReview) {
            return res.status(404).send({ status: false, message: 'Review Data Not Found!' })
        }


        let deletedReview = await reviewModel.findOneAndUpdate
            (
                { _id: reviewId, bookId: bookId, isDeleted: false },
                { isDeleted: true },
                { new: true }
            )


        res.status(200).send({ status: true, message: 'Succesfully Deleted' })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }

}


module.exports = { createReviews, updateReview, deleteReview }