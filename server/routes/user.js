const express = require('express');
const router = express.Router();

const {verifyToken} = require('../middleware/jwt')
const userService = require('../services/userService');

router.get('/', verifyToken, (req, res, next) => {
    return res.locals.user;
})

router.get('/list', async (req, res) => {
    let result;
    try {
        result = await userService.readUser();
    } catch (err) {
        return res.send({code: 500, status: 'SERVER ERROR'});
    }

    return res.send({code: 200, status: 'SUCCESS', data: result});
});