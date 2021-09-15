const express = require('express');
const router = express.Router();

// 라우터 파일 가져오기
const collectionRouter = require('./collection');
const authRouter = require('./auth');
const searchRouter = require('./search');
const placeRouter = require('./place');
const likeRouter = require('./like');
const keywordRouter = require('./keyword');


// 라우터 파일 등록하기
router.use('/auth', authRouter);
router.use('/collection', collectionRouter);
router.use('/search', searchRouter);
router.use('/place', placeRouter);
router.use('/like', likeRouter);
router.use('/keyword', keywordRouter);


module.exports = router;