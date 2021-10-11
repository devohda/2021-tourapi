const express = require('express');
const router = express.Router();

const collectionService = require('../services/collectionService');
const {verifyToken} = require('../middleware/jwt');

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

// CREATE
// 자유 보관함 생성
router.post('/free', verifyToken, async (req, res, next) => {
    const {collectionData, keywords} = req.body;
    const {user} = res.locals;
    const result = await collectionService.createFreeCollection(collectionData, user.user_pk, keywords);

    if (result.collection_pk) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            collectionId: result.collection_pk
        });
    } else {
        return res.status(500).json({
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

    if (result.collection_pk) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            collectionId: result.collection_pk
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 보관함에 장소 추가
router.post('/:collectionId/place/:placeId', verifyToken, async (req, res, next) => {
    const {collectionId, placeId} = req.params;
    const {planDay, order} = req.body;

    const result = await collectionService.createPlaceToCollection(collectionId, placeId, planDay, order);

    if (result.affectedRows === 1) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else if (result.affectedRows === 0) {
        return res.status(202).json({
            code: 202,
            status: 'EXISTED'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 보관함 댓글 생성
router.post('/:collectionId/comments', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const {comment} = req.body;
    const result = await collectionService.createCollectionComment(collectionId, user.user_pk, comment);

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
})

// 보관함 대체 공간 생성
router.post('/:collectionId/replacement/place/:placeId', verifyToken, async (req, res, next) => {
    const {placeId} = req.params;
    const {cpm_map_pk, order} = req.body;
    const result = await collectionService.createCollectionPlaceReplacement(cpm_map_pk, placeId, order);

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
})

// 보관함 공간 한줄평 생성
router.post('/:collectionId/placeList/:cpmMapPk/comment', verifyToken, async (req, res, next) => {
    const {cpmMapPk} = req.params;
    const {comment} = req.body;
    const result = await collectionService.createCollectionPlaceComment(cpmMapPk, comment);

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
})

// READ
// 보관함 리스트 조회
router.get('/list', verifyToken, async (req, res, next) => {
    // 검색, 장소에서 보관함 추가할 때, 마이페이지 에서 사용
    const {sort, keyword, type, term} = req.query;
    const {user} = res.locals;
    const user_pk = user ? user.user_pk : null;

    const result = await collectionService.readCollectionList(user_pk, type, sort, keyword, term);

    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } else {
        return res.status(500).json({
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
        return res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 보관함 장소 리스트 조회
router.get('/:collectionId/places', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const result = await collectionService.readCollectionPlaceList(user.user_pk, collectionId);

    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

// 보관함 댓글 리스트 조회
router.get('/:collectionId/comments', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const result = await collectionService.readCollectionCommentList(collectionId);

    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

// 보관함 대체 공간 리스트
router.get('/:collectionId/replacement/placeList', verifyToken, async (req, res, next) => {
    const {cpm_map_pk} = req.body;
    const {user} = res.locals;
    const result = await collectionService.readCollectionPlaceReplacement(user.user_pk, cpm_map_pk);

    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

// UPDATE
// 보관함 정보 수정
router.put('/:collectionId/info', verifyToken, multer.single('img'), async (req, res, next) => {
    const {collectionId} = req.params;

    if (!req.file) {
        const {collectionData} = req.body;
        const result = await collectionService.updateCollection(collectionId, JSON.parse(collectionData));

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
    }

    const blob = bucket.file(Date.now() + req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', err => {
        next(err);
    });

    blobStream.on('finish', async () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`

        const {collectionData: stringedCollectionData} = req.body;
        const collectionData = {
            ...JSON.parse(stringedCollectionData),
            img: publicUrl
        }
        const result = await collectionService.updateCollection(collectionId, collectionData)

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

// 보관함 장소 리스트 수정
router.put('/:collectionId/places', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;
    const {user} = res.locals;
    const {placeList, deletePlaceList} = req.body;

    const result = await collectionService.updateCollectionPlaceList(user.user_pk, collectionId, placeList, deletePlaceList);

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
})

// 대체 공간 수정
router.put('/:collectionId/replacement/place', verifyToken, async (req, res, next) => {
    const {cpm_map_pk, replacementPlaceList} = req.body;
    const result = await collectionService.updateCollectionPlaceReplacement(cpm_map_pk, replacementPlaceList);

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
})

// 보관함 장소 한줄평 수정
router.put('/:collectionId/placeList/:cpmMapPk/comment', verifyToken, async (req, res, next) => {
    const {cpmMapPk} = req.params;
    const {comment} = req.body;
    const result = await collectionService.updateCollectionPlaceComment(cpmMapPk, comment);

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
})

// DELETE
// 보관함 삭제
router.delete('/:collectionId', verifyToken, async (req, res, next) => {
    const {collectionId} = req.params;

    const result = await collectionService.deleteCollection(collectionId);

    if (result.affectedRows <= 1) {
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

// 보관함에 장소 삭제
router.delete('/:collectionId/place/:placeId', verifyToken, async (req, res, next) => {
    const {collectionId, placeId} = req.params;
    const {planDay} = req.body;

    const result = await collectionService.deletePlaceToCollection(collectionId, placeId, planDay);

    if (result.affectedRows === 1) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else if (result.affectedRows === 0) {
        return res.status(404).json({
            code: 404,
            status: 'NOT EXIST'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

// 보관함 대체 공간 1개 삭제
router.delete('/:collectionId/replacement/place/:placeId', verifyToken, async (req, res, next) => {
    const {placeId} = req.params;
    const {cpm_map_pk} = req.body;
    const result = await collectionService.deleteCollectionPlaceReplacement(cpm_map_pk, placeId);

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
})

// 보관함 대체 공간 전체 삭제
router.delete('/:collectionId/replacement/placeAll', verifyToken, async (req, res, next) => {
    const {cpm_map_pk} = req.body;
    const result = await collectionService.deleteCollectionPlaceReplacementAll(cpm_map_pk);

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
})

// 보관함 장소 한줄평 삭제
router.delete('/:collectionId/placeList/:cpmMapPk/comment', verifyToken, async (req, res, next) => {
    const {cpmMapPk} = req.params;
    const result = await collectionService.deleteCollectionPlaceComment(cpmMapPk);

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
})

module.exports = router;