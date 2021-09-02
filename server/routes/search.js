const express = require('express');
const router = express.Router();

const {selectPlaceList} = require('../services/placeService');
const {selectCollectionList} = require('../services/collectionService');
const {selectUserList} = require('../services/userService');

router.get('/', async (req, res, next) => {
    const {keyword, type} = req.query;
    let data;

    try {
        switch (type) {
            case "place":
                data = await selectPlaceList(keyword);
                break;
            case 'collection':
                data = await selectCollectionList(keyword);
                break;
            case 'user':
                data = await selectUserList(keyword);
                break;
            default:
                break;
        }
    } catch (err) {
        return res.send({code:500, status : "SERVER ERROR"})
    }

    return res.send({code: 200, status: "SUCCESS", data})
})

module.exports = router;