const express = require('express');
const router = express.Router();

const db = require('../database/database')

//자유보관함
router.get('/collections_free', async (req, res) => {
    const testQuery = require('../models/collections');
    const rows = await db.execute(testQuery)
    console.log(rows)
    res.send(rows);
});

router.post('/collections_free_post', async (req, res) => {
    const {collection_name} = req.body;
    const result = await db.query('insert into collections(collection_name) values (?);', collection_name);
    console.log(result)
})

module.exports = router;