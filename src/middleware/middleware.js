const jwt = require('jsonwebtoken')
const { isValid } = require('../validation/validation')
const mongoose = require('mongoose')
const bookModel = require('../model/bookModel')

//--------------------------------{ Authantication }-------------------------------------\\

const Authantication = async function (req, res, next) {

    try {

        let token = req.headers['x-auth-key']

        if (!token) {
            return res.status(400).send({ status: false, message: 'token must be present!' })
        }

        let verifiedToken = jwt.verify(token, 'project/bookManagement-Secret-key016&*%#3$%')

        if (!verifiedToken) {
            return res.status(401).send({ status: false, message: 'Invalid token!' })
        }

        req.verifiedToken = verifiedToken

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }

    next()

}


//--------------------------------{ Authorization }-------------------------------------\\

const Authorization = async function (req, res, next) {

    try {

        let loggedInUserId = req.verifiedToken.userId

        //--------------If UserId from request Body----------------\\

        if (req.body.userId) {

            //----------------user Id validation--------------------\\
            if (!isValid(req.body.userId)) {
                return res.status(400).send({ status: false, message: 'User Id is must to fetch the data!' })
            }
            req.body.userId = req.body.userId.trim()
            if (!mongoose.isValidObjectId(req.body.userId)) {
                return res.status(400).send({ status: false, message: 'User Id is invalid!!' })
            }

            if (req.body.userId != loggedInUserId) {
                return res.status(403).send({ status: false, message: 'LoggedIn User Is Not Allowed to change Other\'s user Data' })
            }

        }

        //----------If userId from request Query Params--------------\\

        if (req.query.userId) {

            //----------------user Id validation--------------------\\
            if (!isValid(req.query.userId)) {
                return res.status(400).send({ status: false, message: 'User Id is must to fetch the data!' })
            }
            req.query.userId = req.query.userId.trim()
            if (!mongoose.isValidObjectId(req.query.userId)) {
                return res.status(400).send({ status: false, message: 'User Id is invalid!!' })
            }

            if (req.query.userId != loggedInUserId) {
                return res.status(403).send({ status: false, message: 'LoggedIn User Is Not Allowed to get Other\'s user Data' })
            }

        }

        //-----------------------Db Call for UserId Check----------------------\\

        if (req.params.bookId) {

            //----------------Book Id validation-----------------\\

            if (!isValid(req.params.bookId)) {
                return res.status(400).send({ status: false, message: 'Book Id is must to get Book!' })
            }
            req.params.bookId = req.params.bookId.trim()
            if (!mongoose.isValidObjectId(req.params.bookId)) {
                return res.status(400).send({ status: false, message: 'Book Id is invalid!!' })
            }

            let checkUser = await bookModel.findOne({ _id: req.params.bookId, isDeleted: false })
            if (!checkUser) {
                return res.status(404).send({ status: false, message: 'Book Not Found!' })
            }

            if (checkUser.userId != loggedInUserId) {
                return res.status(403).send({ status: false, message: 'LoggedIn User Is Not Allowed to get Other\'s user Data' })
            }

        }

    }

    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, error: err.message })
    }

    next()

}


module.exports = { Authantication, Authorization }