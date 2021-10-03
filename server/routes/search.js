const express = require('express');
const router = express.Router();

const {verifyToken} = require('../middleware/jwt');

const {readPlaceList} = require('../services/placeService');
const {readCollectionList} = require('../services/collectionService');
const {readUserList} = require('../services/userService');

router.get('/', verifyToken, async (req, res, next) => {

    const {keyword, type} = req.query;
    const {user} = res.locals;

    let data;

    try {
        switch (type) {
            case 'place':
                data = await readPlaceList(user.user_pk, keyword);
                break;
            case 'collection':
                data = await readCollectionList(null, false, null, keyword);
                break;
            case 'user':
                data = await readUserList(keyword, null);
                break;
            default:
                break;
        }
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data : data
    });
});

module.exports = router;