const express = require('express');
const router = express.Router();

const keywordService = require('../services/keywordService')

router.get('/list', async (req, res) => {
    let result;
    try {
        result = await keywordService.readKeywordList();
    } catch (err) {
        return res.send({code: 500, status: "SERVER ERROR"})
    }

    return res.send({code: 200, status: "SUCCESS", data: result})
});

module.exports = router;