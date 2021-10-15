const express = require('express');
const router = express.Router();

const placeService = require('../services/placeService');
const reviewService = require('../services/reviewService');
const {verifyToken} = require("../middleware/jwt");
const {readPlaceList} = require("../services/placeService");

const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const collectionService = require("../services/collectionService");

const projectId = 'here-327421'
const keyFilename = 'here-327421-e0bed35f44b5.json'
const storage = new Storage({projectId, keyFilename});

const multer = Multer({
    storage: Multer.memoryStorage()
});

const bucket = storage.bucket('here-bucket');

// [READ]
// 장소 리스트
router.get('/list', verifyToken, async (req, res, next) => {
    const {keyword, sort, type} = req.query;
    const {user} = res.locals;

    let data;
    try {
        data = await readPlaceList(user.user_pk, keyword, sort, type);
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data: data
    });
})

// 장소 데이터
router.get('/:placeId', verifyToken, async (req, res, next) => {
    const {placeId} = req.params;
    const {user} = res.locals;
    let data;

    try {
        data = await placeService.readPlace(user.user_pk, placeId);
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data: data
    });
});

// 장소 한줄평 조회
router.get('/:placeId/comments', async (req, res, next) => {
    const {placeId} = req.params;
    let result;

    try {
        result = await placeService.readPlaceCommentList(placeId);
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data: result
    });

})

//[CREATE]
// 장소 리뷰 생성
router.post('/:placeId/review', verifyToken, multer.any(), async (req, res, next) => {
    const {reviewData} = req.body;
    const place_pk = req.params.placeId
    const {user} = res.locals;

    const {review_facility, ...reviewData2} = JSON.parse(reviewData);
    const review = {
        user_pk: user.user_pk,
        place_pk: place_pk,
        ...reviewData2
    }

    const review_pk = await reviewService.createReview(review, review_facility);
    let result = true;

    if (req.files.length !== 0) {
        result = false;

        for (const fil of req.files){
            const blob = bucket.file(Date.now() + fil.originalname);
            const blobStream = blob.createWriteStream();
            blobStream.on('error', err => {
                next(err);
            });

            blobStream.on('finish', async () => {
                // The public URL can be used to directly access the file via HTTP.
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                await reviewService.createReviewImg(place_pk, user.user_pk, review_pk, publicUrl);
            });

            blobStream.end(fil.buffer);
        }

        result = true;
    }

    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

module.exports = router;