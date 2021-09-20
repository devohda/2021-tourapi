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
        return res.send({code: 500, status: 'SERVER ERROR'});
    }

    return res.send({code: 200, status: 'SUCCESS'});

});

// 장소 좋아요 삭제
router.delete('/place/:placeId', verifyToken, async (req, res, next) => {
    const {placeId} = req.params;
    const {user} = res.locals;

    try {
        await likeService.deleteLikePlace(user.user_pk, placeId);
    } catch (err) {
        return res.send({code: 500, status: 'SERVER ERROR'});
    }

    return res.send({code: 200, status: 'SUCCESS'});
});

// 보관함 좋아요
router.post('/collection/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    try {
        await likeService.createLikeCollection(user.user_pk, collectionId);
    } catch (err) {
        return res.send({code: 500, status: 'SERVER ERROR'});
    }

    return res.send({code: 200, status: 'SUCCESS'});
});

// 보관함 좋아요 삭제
router.delete('/collection/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    try {
        await likeService.deleteLikeCollection(user.user_pk, collectionId);
    } catch (err) {
        return res.send({code: 500, status: 'SERVER ERROR'});
    }

    return res.send({code: 200, status: 'SUCCESS'});
});

module.exports = router;