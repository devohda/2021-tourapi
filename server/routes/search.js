const express = require('express');
const router = express.Router();

const {verifyToken} = require('../middleware/jwt');

const {readPlaceList} = require('../services/placeService');
const {readCollectionList} = require('../services/collectionService');
const {selectUserList} = require('../services/userService');

router.get('/', verifyToken, async (req, res, next) => {

    const {keyword, type} = req.query;
    const {user} = res.locals;
    console.log(user);
    console.log(keyword, type);
    let data;

    try {
        switch (type) {
        case 'place':
            data = await readPlaceList(keyword);
            break;
        case 'collection':
            data = await readCollectionList(keyword, null);
            break;
        case 'user':
            data = await selectUserList(keyword);
            break;
        default:
            break;
        }
    } catch (err) {
        return res.send({code: 500, status: 'SERVER ERROR'});
    }

    return res.send({code: 200, status: 'SUCCESS', data});
});

module.exports = router;