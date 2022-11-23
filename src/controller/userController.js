const userModel = require("../model/userModel")
const { isValidTitle, isValid, isValidName, isValidMobile, isValidEmail, isValidPassword } = require("../validation/validation")


const createUser = async function (req, res) {

    try {
        let data = req.body
        let { title, name, phone, email, password } = data

        if (!Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: 'Enter data for registration!' })
        }

        //--------------title validation-------------\\
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: 'Please provide title!' })
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: 'Enter valid title!' })
        }

        //---------------name validation---------------\\
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: 'Please provide name!' })
        }
        name = name.trim()
        if (!isValidName) {
            return res.status(400).send({ status: false, message: 'Enter valid name!' })
        }

        //--------------phone number validation------------\\
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: 'Please provide phone number!' })
        }
        phone = phone.trim()
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, message: 'Enter valid phone!' })
        }

        //----------------email validation----------------\\ 
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: 'Please provide email!' })
        }
        email = email.trim()
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: 'Enter valid email!' })
        }

        //----------------password validation---------------\\ 
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: 'Please provide password!' })
        }
        password = password.trim()
        if (!isValidPassword) {
            return res.status(400).send({ status: false, message: 'Enter valid password!' })
        }


        //-------------------Phone Number Already Exist??----------------------\\
        let checkPhone = await userModel.findOne({ phone: phone })
        if (checkPhone) {
            return res.status(400).send({ status: false, message: 'Phone number already exist!' })
        }

        //-----------------------E-mail Already Exist??--------------------------\\
        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: 'Email already exist!' })
        }


        let savedData = await userModel.create(data)
        res.status(201).send({ status: true, message: 'Success', data: savedData })
    }
    catch (err) {
        console.log({ error: err.message })
        return res.status(500).send({ status: false, error: err.message })
    }
}




module.exports = { createUser }