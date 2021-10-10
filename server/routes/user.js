const express = require('express');
const router = express.Router();

const {verifyToken} = require('../middleware/jwt')
const userService = require('../services/userService');

// const {v4: uuid} = require('uuid');
// const path = require('path');
//
// const multer = require('multer');
// const multerGoogleStorage = require('multer-cloud-storage');
//
// const upload = multer({
//     // GCS_BUCKET : 'here-storage1',
//     // GCLOUD_PROJECT : 'here-327421',
//     // GCS_KEYFILE : 'here-327421-e0bed35f44b5.json'
//
//     // storage : multerGoogleStorage.storageEngine({
//     //     GCS_BUCKET : 'here-storage1',
//     //     GCLOUD_PROJECT : 'here-327421',
//     //     GCS_KEYFILE : 'here-327421-e0bed35f44b5.json'
//     // }),
//
//
//     // storage: multerGoogleStorage.storageEngine({
//     //     bucket: 'here-storage1',
//     //     projectId: 'here-327421',
//     //     keyFilename: 'here-327421-e0bed35f44b5.json'
//     // })
//
//     // storage : multer.diskStorage({
//     //     destination(req, file, cb){
//     //         cb(null, 'public/')
//     //     },
//     //     filename(req, file, cb){
//     //         const ext = path.extname(file.originalname);
//     //         cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//     //     }
//     // })
// });
//
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage({ keyFilename: './here-327421-e0bed35f44b5.json' });
// const bucketname = 'here-storage1';
// const filename = 'here-327421';
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');

const projectId = 'here-327421'
const keyFilename = 'here-327421-e0bed35f44b5.json'
const storage = new Storage({projectId, keyFilename});

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    }
});

const bucket = storage.bucket('here-bucket');

router.get('/', verifyToken, (req, res, next) => {
    const {user_email, user_img, user_nickname} = res.locals.user;
    const userData = {user_email, user_img, user_nickname}
    return res.status(200).json({
        code: 200,
        status: 'OK',
        data: userData
    });
})

router.get('/list', async (req, res) => {
    let result;
    const {keyword, sort, type} = req.query;
    try {
        result = await userService.readUserList(keyword, sort, type);
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data: result
    });
});

router.put('/info', verifyToken, multer.single('img'), async (req, res, next) => {

    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const blob = bucket.file(Date.now() + req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', async () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        console.log(publicUrl);

        const {userData: stringedUserData} = req.body;
        const userData = {
            ...JSON.parse(stringedUserData),
            img: publicUrl
        }
        const {user} = res.locals;
        const result = await userService.updateUserInfo(user.user_pk, userData)

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
    });

    blobStream.end(req.file.buffer);
})
module.exports = router;