const express = require('express');
const router = express.Router();

const db = require('../database/database')

//자유보관함
router.get('/collections_free', async (req, res) => {
    const testQuery = require('../models/collections');
    const rows = await db.execute(testQuery)
    res.json(rows);
});

module.exports = router;