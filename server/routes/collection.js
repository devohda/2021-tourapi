const express = require('express');
const router = express.Router();

const collectionService = require('../services/collectionService');
const {verifyToken} = require('../middleware/jwt');

// CREATE
// 자유 보관함 생성
router.post('/free', verifyToken, async (req, res, next) => {
    const {collectionData, keywords} = req.body;
    const {user} = res.locals;
    const result = await collectionService.createFreeCollection(collectionData, user.user_pk, keywords);

    if (result.collection_pk) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            collectionId : result.collection_pk
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 일정 보관함 생성
router.post('/plan', verifyToken, async (req, res, next) => {
    const {collectionData, keywords} = req.body;
    const {user} = res.locals;
    const result = await collectionService.createPlanCollection(collectionData, user.user_pk, keywords);

    if (result.collection_pk) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            collectionId : result.collection_pk
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 보관함에 장소 추가하기
router.post('/:collectionId/place/:placeId', verifyToken, async (req, res, next) => {
    const {collectionId, placeId} = req.params;
    const {planDay} = req.body;

    const result = await collectionService.createPlaceToCollection(collectionId, placeId, planDay);

    if (result.affectedRows === 1) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else if (result.affectedRows === 0) {
        return res.status(202).json({
            code: 202,
            status: 'EXISTED'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// READ
// 보관함 리스트 조회
router.get('/list', verifyToken, async (req, res, next) => {
    // 검색, 장소에서 보관함 추가할 때, 마이페이지 에서 사용
    const {sort, keyword, type} = req.query;
    const {user} = res.locals;
    const user_pk = user ? user.user_pk : null;

    const result = await collectionService.readCollectionList(user_pk, type, sort, keyword);

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
});

// 보관함 조회
router.get('/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const result = await collectionService.readCollection(user.user_pk, collectionId);

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
});

// 보관함 장소 리스트 조회
router.get('/:collectionId/places',verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const result = await collectionService.readCollectionPlaceList(user.user_pk, collectionId);

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

// 보관함 댓글 리스트 조회
router.get('/:collectionId/comments',async (req, res, next) => {

})

// UPDATE
// 보관함 장소 리스트 수정
router.put('/:collectionId/places', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const {placeList} = req.body;

    const result = await collectionService.updateCollectionPlaceList(user.user_pk, collectionId, placeList);

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
})

// DELETE
// 보관함 삭제
router.delete('/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;

    const result = await collectionService.deleteCollection(collectionId);

    if (result.affectedRows <= 1) {
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
});

// 보관함에 장소 삭제
router.delete('/:collectionId/place/:placeId', verifyToken, async (req, res, next) => {
    const {collectionId, placeId} = req.params;
    const {planDay} = req.body;

    const result = await collectionService.deletePlaceToCollection(collectionId, placeId, planDay);

    if (result.affectedRows === 1) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else if (result.affectedRows === 0) {
        return res.status(404).json({
            code: 404,
            status: 'NOT EXIST'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

module.exports = router;