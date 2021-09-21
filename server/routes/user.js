const express = require('express');
const router = express.Router();

const {verifyToken} = require('../middleware/jwt')
const userService = require('../services/userService');

router.get('/', verifyToken, (req, res, next) => {
    const {user_email, user_img, user_nickname} = res.locals.user;
    const userData = {user_email, user_img, user_nickname}
    return res.send({code: 200, status: 'SUCCESS', data: userData});
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

module.exports = router;