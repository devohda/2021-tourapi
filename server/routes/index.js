const express = require('express');
const router = express.Router();

// 라우터 파일 가져오기
const collectionRouter = require('./collection');
const authRouter = require('./auth');
const placeRouter = require('./place');
const likeRouter = require('./like');
const keywordRouter = require('./keyword');
const userRouter = require('./user');
const viewRouter = require('./view');
const facilityRouter = require('./facility');
// const tourApiRouter = require('./tourApi');
const visitantRouter = require('./visitant');


// 라우터 파일 등록하기
router.use('/auth', authRouter);
router.use('/collection', collectionRouter);
router.use('/place', placeRouter);
router.use('/like', likeRouter);
router.use('/keyword', keywordRouter);
router.use('/user', userRouter);
router.use('/view', viewRouter);
router.use('/facility', facilityRouter);
// router.use('/tourApi', tourApiRouter);
router.use('/visitant', visitantRouter);


module.exports = router;