const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const bookController = require('../controller/bookController')
const reviewController = require('../controller/reviewController')
const MW = require('../middleware/middleware')
const cloud = require('../aws/aws')


//-------------------------{ user apis }-----------------------------//

router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)



//-------------------------{ book apis }-----------------------------//

router.post('/books', MW.Authantication, MW.Authorization, bookController.createBooks)
router.get('/books', MW.Authantication, MW.Authorization, bookController.getAllBooks)
router.get('/books/:bookId', MW.Authantication, MW.Authorization, bookController.getBook)
router.put('/books/:bookId', MW.Authantication, MW.Authorization, bookController.updateBook)
router.delete('/books/:bookId', MW.Authantication, MW.Authorization, bookController.deleteBook)

//--------------------------{ aws api }--------------------------------//

router.post("/write-file-aws", cloud.uploadBookcover)



//-------------------------{ review apis }-----------------------------//

router.post('/books/:bookId/review', reviewController.createReviews)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview)





module.exports = router