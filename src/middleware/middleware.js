const jwt = require('jsonwebtoken')
const { isValid } = require('../validation/validation')
const mongoose = require('mongoose')

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
            if (!mongoose.isValidObjectId(req.query.userId)) {
                return res.status(400).send({ status: false, message: 'User Id is invalid!!' })
            }

            if (req.body.userId != loggedInUserId) {
                return res.status(403).send({ status: false, message: 'LoggedIn User Is Not Allowed to get Other\'s user Data' })
            }
            if (req.query.userId != loggedInUserId) {
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