const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const reviewController = require('../controller/reviewController')


//-------------------------{ user apis }-----------------------------//

router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)



//-------------------------{ book apis }-----------------------------//

router.post('/books', bookController.createBooks)
router.get('/books', bookController.getAllBooks)
router.get('/books/:bookId', bookController.getBook)
router.put('/books/:bookId', bookController.updateBook)
router.delete('/books/:bookId', bookController.deleteBook)



//-------------------------{ review apis }----------------------------//

router.post('/books/:bookId/review', reviewController.createReviews)





module.exports = router