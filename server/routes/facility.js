const express = require('express');
const router = express.Router();

const facilityService = require('../services/facilityService');

router.get('/list', async (req, res) => {
    let result;
    try {
        result = await facilityService.readFacilityList();
    } catch (err) {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data : result
    });
});

module.exports = router;