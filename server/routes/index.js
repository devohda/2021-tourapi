const express = require('express');
const router = express.Router();

// 라우터 파일 가져오기
const collectionRouter = require('./collections');
const authRouter = require('./auth');
const keywordRouter = require('./keywords');
const userRouter = require('./users');
<<<<<<< HEAD
const likeRouter = require('./likes');
=======
const tourApiRouter = require('./tourApi');

>>>>>>> 9a4102882d6d48b6c4fa72364fd94ae1751f7ba9

// 라우터 파일 등록하기
router.use('/collections', collectionRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/keyword', keywordRouter);
<<<<<<< HEAD
router.use('/like', likeRouter);
=======
router.use('/tourapi', tourApiRouter);
>>>>>>> 9a4102882d6d48b6c4fa72364fd94ae1751f7ba9

module.exports = router;