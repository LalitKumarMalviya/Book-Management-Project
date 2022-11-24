const { default: mongoose } = require("mongoose")
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const userModel = require("../model/userModel")
const { isValid, isValidISBN, isValidDate } = require("../validation/validation")
const moment = require('moment')



//---------------------------------{ create Book }----------------------------------\\

const createBooks = async function (req, res) {

    try {

        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'Please Enter Books data!' })
        }

        //-------------- Book title validation -------------\\

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Please provide title!' })
        }

        //-------------- Book excerpt validation --------------\\

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: 'Please provide excerpt!' })
        }

        //---------------- user _id validation -----------------\\

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: 'Please provide useId!' })
        }
        userId = userId.trim()
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'Enter valid userId!' })
        }

        //------------------- ISBN validation ------------------\\

        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: 'Please provide ISBN!' })
        }
        ISBN = ISBN.trim()
        if (!isValidISBN(ISBN)) {
            return res.status(400).send({ status: false, message: 'Enter valid ISBN!' })
        }

        //------------------ category validation ------------------\\

        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: 'Please provide category!' })
        }

        //------------------ subcategory validation ------------------\\

        if (!isValid(subcategory)) {
            return res.status(400).send({ status: false, message: 'Please provide subcategory!' })
        }


        let savedData = await bookModel.create(data)
        res.status(201).send({ status: true, message: 'Success', data: savedData })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }


}



//----------------------------------{ get Books By Query }----------------------------------\\

const getAllBooks = async function (req, res) {

    try {

        let data = req.query
        let { userId, category, subcategory, } = data

        let filter = {
            ...data,
            userId: userId,
            isDeleted: false
        }

        //----------------user Id validation--------------------\\

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: 'User Id is must to fetch the data!' })
        }
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: 'User Id is invalid!!' })
        }

        //---------------------Db call-----------------------------\\

        let checkuser = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!checkuser) {
            return res.status(404).send({ status: false, message: 'User is not Exist!' })
        }

        //----------------category & subcategory validation-----------\\

        if (category) {
            if (category === "") {
                return res.status(400).send({ status: false, message: 'category is Empty!' })
            }
        }
        if (subcategory) {
            if (subcategory === "") {
                return res.status(400).send({ status: false, message: 'subcategory is Empty!' })
            }
        }

        //---------------------- Db call -------------------------\\

        let booksData = await bookModel.find(filter)
            .sort({ title: 1 })
            .select({ createdAt: 0, updatedAt: 0, __v: 0 })
        if (booksData.length === 0) {
            return res.status(404).send({ status: false, message: 'Books are not Found!' })
        }

        //-------Sorted by book title in Alphabatical order--------\\

        res.status(200).send({ status: true, message: 'Success', data: booksData })

    }

    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, error: err.message })
    }
}


//----------------------------------{ get Books By Param }---------------------------------\\

const getBook = async function (req, res) {

    try {

        let { bookId } = req.params

        //----------------Book Id validation--------------------\\

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is must to fetch the data!' })
        }
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is invalid!!' })
        }

        let findBookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBookData) {
            return res.status(404).send({ status: false, message: 'Book Not Found!' })
        }

        let reviewsData = await reviewModel.find({ bookId: bookId })
        let numberOfData = reviewsData.length

        let setData = findBookData.toObject()
        setData.reviewsData = reviewsData
        setData.reviews = numberOfData

        res.status(200).send({ status: true, message: 'Book List', data: setData })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }
}


//------------------------------------{ Update Books }------------------------------------\\

const updateBook = async function (req, res) {

    try {

        let bookId = req.params.bookId
        let data = req.body
        let { title, excerpt, releasedAt, ISBN } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'Please Enter data to Update Book!' })
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

        //-----------------title validation------------------//

        if (title) {
            if (title === "") {
                return res.status(400).send({ status: false, message: 'Book title is Empty!' })
            }
            title = title.trim()
            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: 'Book title is invalid!' })
            }
        }

        //-----------------excerpt validation------------------//

        if (excerpt) {
            if (excerpt === "") {
                return res.status(400).send({ status: false, message: 'excerpt is Empty!' })
            }
            excerpt = excerpt.trim()
            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, message: 'Book excerpt is invalid!' })
            }
        }

        //-------------------ISBN validation------------------//

        if (ISBN) {
            if (ISBN === "") {
                return res.status(400).send({ status: false, message: 'ISBN is Empty!' })
            }
            ISBN = ISBN.trim()
            if (!isValidISBN(ISBN)) {
                return res.status(400).send({ status: false, message: 'ISBN is Not valid!' })
            }
        }
        //-----------------releaseAt validation-----------------//

        if (releasedAt) {
            if (releasedAt === "") {
                return res.status(400).send({ status: false, message: 'releasedAt is Empty!' })
            }
            releasedAt = releasedAt.trim()
            if (!isValidDate(releasedAt)) {
                return res.status(400).send({ status: false, message: 'releasedAt Date is Not valid!' })
            }
        }


        let updatedBook = await bookModel.findOneAndUpdate

            (
                { _id: bookId },
                {
                    $set: {
                        title: title,
                        excerpt: excerpt,
                        ISBN: ISBN,
                        releasedAt: releasedAt
                    }
                },
                { new: true }
            )

        res.status(200).send({ status: true, message: 'Success', data: updatedBook })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }


}

//----------------------------------{ Delete Books }---------------------------------\\

const deleteBook = async function (req, res) {

    try {
        let bookId = req.params.bookId

        //----------------Book Id validation-----------------\\

        if (!isValid(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is must to fetch the data!' })
        }
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: 'Book Id is invalid!!' })
        }

        //----------------------Db Call------------------------\\

        let findDataBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findDataBook) {
            return res.status(404).send({ status: false, message: 'Book Not Found!' })
        }

        let deletedBook = await bookModel.findByIdAndUpdate(
            { _id: bookId },
            { isDeleted: true, deletedAt: moment().format() },
            { new: true }
        )

        res.status(200).send({ status: true, message: 'Successfully Deleted!' })

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }

}

module.exports = { createBooks, getAllBooks, getBook, updateBook, deleteBook }