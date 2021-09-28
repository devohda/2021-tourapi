const express = require('express');
const router = express.Router();
 
const placeService = require('../services/placeService');

router.get('/:placeId', async (req, res, next) => {
    const {placeId} = req.params;
    let data;

    try {
        data = await placeService.readPlace(placeId);
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