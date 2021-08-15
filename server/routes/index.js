const express = require('express');
const router = express.Router();

// 라우터 파일 가져오기
const collectionRouter = require('./collections');
const authRouter = require('./auth');


// 라우터 파일 등록하기
router.use('/collections', collectionRouter);
router.use('/auth', authRouter);



module.exports = router;