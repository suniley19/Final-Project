const express = require('express')
const router = express.Router()
const {
    registerUser,
    loginUser,
    tokenCheck
} = require('../controller/userController')
const validateToken = require('../middleware/validateTokenHandler')

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/tokenCheck', validateToken, tokenCheck)

module.exports = router;