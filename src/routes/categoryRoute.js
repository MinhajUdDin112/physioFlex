const express = require('express')
const auth = require('../middleWare/authMiddleware');
const {
    addCategory
} = require('../controllers/categoryCtrl')

//**********Router**********
const router = express.Router()

router.post('/add-category', auth, addCategory)

module.exports = router