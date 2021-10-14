const express = require('express');
const router = express.Router();

const likeService = require('../services/likeService');
const {verifyToken} = require('../middleware/jwt');

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
    const {sort} = req.query;
    const result = await likeService.readLikePlace(user.user_pk, sort);

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

// 보관함 좋아요
router.post('/collection/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    try {
        await likeService.createLikeCollection(user.user_pk, collectionId);
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

// 보관함 좋아요 조회
router.get('/collectionList', verifyToken, async (req, res, next) => {
    const {user} = res.locals;
    const {sort} = req.query;
    const result = await likeService.readLikeCollection(user.user_pk, sort);

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

// 보관함 좋아요 삭제
router.delete('/collection/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    try {
        await likeService.deleteLikeCollection(user.user_pk, collectionId);
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