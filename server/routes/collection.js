const express = require('express');
const router = express.Router();

const collectionService = require('../services/collectionService')

// 보관함 생성
router.post('/', async (req, res, next) => {
    const {collectionData, userId, keywords} = req.body;
    const result = await collectionService.createCollection(collectionData, userId, keywords);

    if (result) {
        return res.send({
            code: 200,
            status: 'SUCCESS'
        })
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        })
    }
})

// 보관함 가져오기
router.get('/:collectionId', async (req, res, next) => {
    const {collectionId} = req.params;
    const result = await collectionService.readCollection(collectionId);

    if (result) {
        return res.send({
            code: 200,
            status: 'SUCCESS',
            data : result
        })
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        })
    }
})


// 자유보관함
router.post('/list', async (req, res, next) => {
    const {userId} = req.body;

    const result = await collectionService.readCollectionListForPlaceInsert(userId);

    if (result) {
        return res.send({
            code: 200,
            status: 'SUCCESS',
            data: result
        })
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        })
    }
})

// 보관함에 장소 추가하기
router.post('/:collectionId/place', async (req, res, next) => {
    const {collectionId} = req.params;
    const {userId} = req.body;

    const result = await collectionService.createPlaceToCollection(collectionId, userId);

    if (result.affectedRows === 1) {
        return res.send({
            code: 200,
            status: 'SUCCESS'
        })
    } else if (result.affectedRows === 0) {
        return res.send({
            code: 202,
            status: 'EXISTED'
        })
    } else {
        return res.send({
            code: 500,
            status: 'SERVER ERROR'
        })
    }
})


module.exports = router;