const express = require('express');
const jwt = require('jsonwebtoken');

const {verifyToken} = require('./middleware');

const router = express.Router();

router.post('/token', (req, res) => {
    const {clientSecret} = req.body;

})
