let mongoose = require("mongoose")


//Value Validation
let isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

//String Validation
let isValidString = function (value) {
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

//Name Validation
let isValidName = function (name) {
    let nameRegex = /^[a-zA-Z ]{2,30}$/
    return nameRegex.test(name)
}

//Title Validation
let isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].includes(title)
}

//Mobile Validation
let isValidMobile = function (mobile) {
    let re = /^[6789][0-9]{9}$/;
    return re.test(mobile);
}

//Email Validation
let isValidEmail = function (email) {
    let emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    
    return emailRegex.test(email)
}

//Password Validation
let isValidPassword = function (password) {
    let passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/
    return passRegex.test(password)
}

//ObjectId Validation
let isValidObjectId = function (id) {
    let ObjectId = mongoose.Types.ObjectId;
    return ObjectId.isValid(id)
}

//ISBN Validation
let isValidISBN = function (ISBN) {
    let dateRegex = /^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/
    return dateRegex.test(ISBN)
}

//Date Validation
let isValidDate = function (date) {
    let dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    return dateRegex.test(date)
}

//Rating Validation
let isValidRating = function isInteger(value) {
    return value % 1 == 0;
}

module.exports = {
    isValidName,
    isValidString,
    isValidTitle,
    isValidMobile,
    isValidISBN,
    isValidEmail,
    isValidPassword,
    isValidObjectId,
    isValid,
    isValidDate,
    isValidRating
}