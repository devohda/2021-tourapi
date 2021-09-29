const express = require('express');
const router = express.Router();
 
const placeService = require('../services/placeService');
const reviewService = require('../services/reviewService');
const {verifyToken} = require("../middleware/jwt");

// 장소 데이터
router.get('/:placeId', async (req, res, next) => {
    const {placeId} = req.params;
    let data;

    try {
        data = await placeService.readPlace(placeId);
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data : data
    });
});

// 장소 리뷰 생성
router.post('/:placeId/review', verifyToken, async (req, res, next) => {
    const {reviewData} = req.body;
    const place_pk = req.params.placeId
    const {user} = res.locals;

    try {
        const review = {
            user_pk : user.user_pk,
            place_pk : place_pk,
            ...reviewData
        }

        await reviewService.createReview(review);
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