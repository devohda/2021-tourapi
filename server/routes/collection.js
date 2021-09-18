const express = require('express');
const router = express.Router();

const collectionService = require('../services/collectionService');
const {verifyToken} = require('../middleware/jwt');

// 보관함 생성
router.post('/', verifyToken, async (req, res, next) => {
    const {collectionData, keywords} = req.body;
    const {user} = res.locals;
    const result = await collectionService.createCollection(collectionData, user.user_pk, keywords);

    if (result) {
        return res.send({
            code: 200,
            status: 'SUCCESS'
        });
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 자유보관함
router.get('/list', verifyToken, async (req, res, next) => {
    const {user} = res.locals;
    const result = await collectionService.readCollectionListForPlaceInsert(user.user_pk);

    if (result) {
        return res.send({
            code: 200,
            status: 'SUCCESS',
            data: result
        });
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 보관함 가져오기
router.get('/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const result = await collectionService.readCollection(user.user_pk, collectionId);

    if (result) {
        return res.send({
            code: 200,
            status: 'SUCCESS',
            data : result
        });
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});


// 보관함에 장소 추가하기
router.post('/:collectionId/place', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;

    const result = await collectionService.createPlaceToCollection(collectionId, user.user_pk);

    if (result.affectedRows === 1) {
        return res.send({
            code: 200,
            status: 'SUCCESS'
        });
    } else if (result.affectedRows === 0) {
        return res.send({
            code: 202,
            status: 'EXISTED'
        });
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});


module.exports = router;