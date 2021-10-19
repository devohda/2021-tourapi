const express = require('express');
const router = express.Router();

const visitantService = require('../services/visitantService');
const {verifyToken} = require('../middleware/jwt');

// 한달 간 가장 많이 방문한 장소
router.get('/place', async (req, res, next) => {
    let result;
    try {
        result = await visitantService.readMostVisitant();
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data : result
    });
});

module.exports = router;