const express = require('express');
const router = express.Router();

const db = require('../database/database')
const { keywordQuery } = require('../models/keywords');

router.get('/keywords', async (req, res) => {
    const rows = await db.execute(keywordQuery)
    console.log(rows)
    res.send(rows);
});

module.exports = router;