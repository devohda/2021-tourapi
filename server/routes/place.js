const express = require('express');
const router = express.Router();
 
const placeService = require('../services/placeService');

router.get('/:placeId', async (req, res, next) => {
    const {placeId} = req.params;
    let data;

    try {
        data = await placeService.readPlace(placeId);
    } catch (err) {
        return res.send({code:500, status : 'SERVER ERROR'});
    }

    return res.send({code: 200, status: 'OK', data});
});



module.exports = router;