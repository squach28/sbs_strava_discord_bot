const express = require('express')
const {exchangeToken, getAccessToken} = require('../controllers/stravaController')
const router = express.Router()

router.get('/exchangeToken', exchangeToken)
router.get('/accessToken', getAccessToken)

module.exports = router
