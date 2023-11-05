const express = require('express')
const {
    registerUser,loginUser,refreshTok,forgetPassword,resetpassword
} = require('../controllers/authCtrl')

//router
const router = express.Router()

//Register
router.post('/register', registerUser)

//login
router.post('/login',loginUser)

router.post('/refresh', refreshTok)

//forget password
router.post('/forget-password',forgetPassword)

//reset password
router.get('/reset-password',resetpassword)

module.exports = router