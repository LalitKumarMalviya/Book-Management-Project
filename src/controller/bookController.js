const { default: mongoose } = require("mongoose")
const bookModel = require("../model/bookModel")
const reviewModel = require("../model/reviewModel")
const userModel = require("../model/userModel")
const { isValid, isValidISBN, isValidDate, isValidStreet, isValidCity, isValidPincode } = require("../validation/validation")
const moment = require('moment')



//---------------------------------{ create Book }----------------------------------\\

const createBooks = async function (req, res) {

    try {

        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, address } = data

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'Please Enter Books data!' })
        }

        //-------------- Book title validation -------------\\

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Please provide title!' })
        }

        //-------------- Book excerpt validation -------------\\

        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: 'Please provide excerpt!' })
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

        //-------------------- address validation-----------------------\\

        if (Object.keys(data.address).length === 0) {
            return res.status(400).send({ status: false, message: 'Please provide address!' })
        }

        //Street Validator
        if (!isValidStreet(address.street)) {
            return res.status(400).send({ status: false, message: 'Please provide Street!' })
        }

        //City Validator
        if (!isValidCity(address.city)) {
            return res.status(400).send({ status: false, message: 'Please provide valid City!' })
        }

        //Pincode Validator
        if (!isValidPincode(address.pincode)) {
            return res.status(400).send({ status: false, message: 'Please provide valid Pincode!' })
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

        //-----------------------Db call--------------------------\\

        let checkuser = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!checkuser) {
            return res.status(404).send({ status: false, message: 'User is not Exist!' })
        }

        //----------------------category validation------------------\\

        if (category || category === "") {
            if (!isValid(category)) {
                return res.status(400).send({ status: false, message: 'category is Empty!' })
            }
        }

        //---------------------subcategory validation-------------------\\

        if (subcategory || subcategory === "") {
            if (!isValid(subcategory)) {
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

        //----------------Db Call--------------//
        let findBookData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBookData) {
            return res.status(404).send({ status: false, message: 'Book Not Found!' })
        }

        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false })
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

        //-----------------title validation------------------//

        if (title || title === "") {
            if (!isValid(title)) {
                return res.status(400).send({ status: false, message: 'Book title is Empty!' })
            }
        }

        //-----------------excerpt validation-----------------//

        if (excerpt || excerpt === "") {
            if (!isValid(excerpt)) {
                return res.status(400).send({ status: false, message: 'Book excerpt is Empty!' })
            }
        }

        //-------------------ISBN validation------------------//

        if (ISBN || ISBN === "") {
            if (!isValidISBN(ISBN)) {
                return res.status(400).send({ status: false, message: 'ISBN is Empty!' })
            }
        }

        //-----------------releaseAt validation-----------------//

        if (releasedAt || releasedAt === "") {
            if (!isValidDate(releasedAt)) {
                return res.status(400).send({ status: false, message: 'releasedAt Date is Not valid!' })
            }
        }


        let updatedBook = await bookModel.findOneAndUpdate

            (
                { _id: bookId, isDeleted: false },
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

        let deletedBook = await bookModel.findOneAndUpdate

            (
                { _id: bookId, isDeleted: false },
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