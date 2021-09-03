const express = require('express');
const router = express.Router();

const likeService = require('../services/likeService');
const placeService = require("../services/placeService");


// 장소 좋아요
router.post('/place', async (req, res, next) => {
    const {userId, placeId} = req.body;

    try {
        await likeService.createLikePlace(userId, placeId);
    } catch (err) {
        return res.send({code: 500, status: "SERVER ERROR"})
    }

    return res.send({code: 200, status: "SUCCESS"})

})

// 장소 좋아요 삭제
router.delete('/place', async (req, res, next) => {
    const {userId, placeId} = req.body;

    try {
        await likeService.deleteLikePlace(userId, placeId);
    } catch (err) {
        return res.send({code: 500, status: "SERVER ERROR"})
    }

    return res.send({code: 200, status: "SUCCESS"})
})

// 보관함 좋아요
router.post('/collection', async (req, res, next) => {
    const {userId, collectionId} = req.body;
    try {
        await likeService.createLikeCollection(userId, collectionId);
    } catch (err) {
        return res.send({code: 500, status: "SERVER ERROR"})
    }

    return res.send({code: 200, status: "SUCCESS"})
})

// 보관함 좋아요 삭제
router.delete('/collection', async (req, res, next) => {
    const {userId, collectionId} = req.body;
    try {
        await likeService.deleteLikeCollection(userId, collectionId);
    } catch (err) {
        return res.send({code: 500, status: "SERVER ERROR"})
    }

    return res.send({code: 200, status: "SUCCESS"})
})

module.exports = router;