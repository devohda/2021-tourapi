const express = require('express');
const router = express.Router();
 
const placeService = require('../services/placeService');
const reviewService = require('../services/reviewService');
const {verifyToken} = require("../middleware/jwt");
const {readPlaceList} = require("../services/placeService");

// [READ]
// 장소 리스트
router.get('/list', verifyToken, async (req, res, next) => {
    const {keyword, sort, type} = req.query;
    const {user} = res.locals;

    let data;
    try{
        data = await readPlaceList(user.user_pk, keyword, sort, type);
    }catch (err) {
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
})

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

//[CREATE]
// 장소 리뷰 생성
router.post('/:placeId/review', verifyToken, async (req, res, next) => {
    const {reviewData} = req.body;
    const place_pk = req.params.placeId
    const {user} = res.locals;
    const {review_facility, ...reviewData2} = reviewData;
    try {
        const review = {
            user_pk : user.user_pk,
            place_pk : place_pk,
            ...reviewData2
        }
        console.log(review_facility)

        await reviewService.createReview(review, review_facility);
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