const express = require('express');
const router = express.Router();

// 라우터 파일 가져오기
const collectionRouter = require('./collection');
const authRouter = require('./auth');
const keywordRouter = require('./keywords');
const userRouter = require('./users');
const likeRouter = require('./likes');
const tourApiRouter = require('./tourApi');
const searchRouter = require('./search');


// 라우터 파일 등록하기
router.use('/collection', collectionRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/keyword', keywordRouter);
router.use('/like', likeRouter);
router.use('/tourapi', tourApiRouter);
router.use('/search', searchRouter);

module.exports = router;