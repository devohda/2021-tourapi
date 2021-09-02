const express = require('express');
const router = express.Router();

const {createCollectionFree} = require('../services/collectionService');

// 자유보관함 생성
router.post('/free', async (req, res, next) => {
    const {collectionData, userId, keywords} = req.body;
    const result = await createCollectionFree(collectionData, userId, keywords);

    if (result) {
        return res.send({
            code: 200,
            'status': 'SUCCESS'
        })
    } else {
        return res.send({
            code: 500,
            'status': 'SERVER ERROR'
        })
    }
})

// 자유보관함 가져오기
router.get('/free/:id', async (req, res, next) => {
    const collectionId = req.params.id;

})

// 일정보관함 가져오기
router.get('/plan/:collection_id', async () => {

})

// 자유보관함


module.exports = router;