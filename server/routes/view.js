const express = require('express');
const router = express.Router();

const viewService = require('../services/viewService');
const {verifyToken} = require('../middleware/jwt');

// 장소 좋아요
router.post('/place/:placeId', verifyToken, async (req, res, next) => {
    const {placeId} = req.params;
    const {user} = res.locals;

    try {
        await viewService.createViewPlace(user.user_pk, placeId);
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
        await viewService.createViewCollection(user.user_pk, collectionId);
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