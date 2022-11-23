const express = require('express')
const router = express.Router()
const UserController = require('../controller/userController')

//------------------------------[user apis]---------------------------------//
router.post('/register', UserController.createUser)







module.exports = router