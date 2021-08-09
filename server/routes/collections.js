const express = require('express');
const router = express.Router();

const db = require('../database/database')
const { collectionsQuery, getCollectionsFromUsersQuery } = require('../models/collections');

// collectionsQuery = "select * from collections;",
// getCollectionsFromUsersQuery : 'select * from collections where user_pk =',
//자유보관함
router.get('/collections_free', async (req, res) => {
    const rows = await db.execute(collectionsQuery)
    console.log(rows)
    res.send(rows);
});

router.get('/collections_free_fromUsers', async (req, res) => {
    //임의로 user_pk를 정했고, 로그인과 연동이되면 거기에서 get을 쏴서 user_pk 받아올 예정
    const rows = await db.query(getCollectionsFromUsersQuery + '3')
    console.log(rows)
    res.send(rows);
});

router.post('/collections_free_post', async (req, res) => {
    const {collection_name} = req.body;
    //회원가입 때 날아온 user_pk를 넣어줘야한다
    const result = await db.query('insert into collections(collection_name, user_pk) values (?, 3);', collection_name);
    console.log(result)
})

module.exports = router;