const express = require('express');
const router = express.Router();

const reportService = require('../services/reportService');
const {verifyToken} = require('../middleware/jwt');

// 댓글 신고
router.post('/comment/:commentId', verifyToken, async (req, res, next) => {
    const {commentId} = req.params;
    const {user} = res.locals;

    try {
        await reportService.createReportComment(user.user_pk, commentId);
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK'
    });
});

// 보관함 신고
router.post('/collection/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    try {
        await reportService.createReportCollection(user.user_pk, collectionId);
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK'
    });
});

module.exports = router;