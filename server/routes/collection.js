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

// 일정 보관함 생성
router.post('/plan', verifyToken, async (req, res, next) => {
    const {collectionData, keywords} = req.body;
    const {user} = res.locals;
    const result = await collectionService.createPlanCollection(collectionData, user.user_pk, keywords);

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

// 보관함에 장소 추가하기
router.post('/:collectionId/place/:placeId', verifyToken, async (req, res, next) => {
    const {collectionId, placeId} = req.params;
    const {planDay} = req.body;

    const result = await collectionService.createPlaceToCollection(collectionId, placeId, planDay);

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

// READ
// 보관함 리스트 조회
router.get('/list', verifyToken, async (req, res, next) => {
    // 검색, 장소에서 보관함 추가할 때, 마이페이지 에서 사용
    const {sort, keyword} = req.query;
    const {user} = res.locals;
    const result = await collectionService.readCollectionList(user.user_pk, true, sort, keyword);

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

// 보관함 조회
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

// 보관함 장소 리스트 조회
router.get('/:collectionId/places',verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const result = await collectionService.readCollectionPlaceList(user.user_pk, collectionId);

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
        return res.send({
            code: 200,
            status: 'SUCCESS',
        });
    } else {
        return res.send({
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

module.exports = router;