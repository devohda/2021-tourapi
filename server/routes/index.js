const express = require('express');
const router = express.Router();

// 라우터 파일 가져오기
const collectionRouter = require('./collections');
const authenticationRouter = require('./authentication');
const keywordRouter = require('./keywords');
const userRouter = require('./users');


// 라우터 파일 등록하기
router.use('/collections', collectionRouter);
router.use('/authentication', authenticationRouter);
router.use('/user', userRouter);
router.use('/keyword', keywordRouter);

module.exports = router;