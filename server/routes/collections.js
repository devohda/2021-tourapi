const express = require('express');
const router = express.Router();

const db = require('../database/database')

//자유보관함
router.get('/collections_free', async (req, res) => {
    const testQuery = require('../models/collections');
    const rows = await db.execute(testQuery)
    res.json(rows);
});

router.post('/collections_free_post', function(req, res) {
    console.log(req.body);
    const body = req.body;
    connection.query('insert into collections (collection_name) values (?);', [body.collection_name], function(err,rows,fields){
        if(err){
            console.log("실패");
            // console.log(err);
        }else{
            console.log("성공");
            // console.log(rows);
        };
    });
})

module.exports = router;