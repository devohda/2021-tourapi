const express = require('express');
const router = express.Router();

// 라우터 파일 가져오기
const collectionRouter = require('./collection');
const authRouter = require('./auth');
const userRouter = require('./users');
const searchRouter = require('./search');
const placeRouter = require('./place');
const likeRouter = require('./like');


// 라우터 파일 등록하기
router.use('/auth', authRouter);
router.use('/collection', collectionRouter);
router.use('/user', userRouter);
router.use('/search', searchRouter);
router.use('/place', placeRouter);
router.use('/like', likeRouter);

module.exports = router;