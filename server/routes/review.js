const express = require('express');
const router = express.Router();

const reviewService = require('../services/reviewService');
const {verifyToken} = require("../middleware/jwt");
const likeService = require("../services/likeService");

// 장소 좋아요
router.post('/place/:placeId', verifyToken, async (req, res, next) => {
    const {placeId} = req.params;
    const {user} = res.locals;

    try {
        await likeService.createLikePlace(user.user_pk, placeId);
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

// 장소 좋아요 조회
router.get('/placeList', verifyToken, async (req, res, next) => {
    const {user} = res.locals;
    const result = await likeService.readLikePlace(user.user_pk);

    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            data : result
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

// 장소 좋아요 삭제
router.delete('/place/:placeId', verifyToken, async (req, res, next) => {
    const {placeId} = req.params;
    const {user} = res.locals;

    try {
        await likeService.deleteLikePlace(user.user_pk, placeId);
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