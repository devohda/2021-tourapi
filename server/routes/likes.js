const express = require('express');
const router = express.Router();

const db = require('../database/database')
const { likesQuery, getLikesFromUsersQuery } = require('../models/likes');

router.get('/likes', async (req, res) => {
    const rows = await db.execute(likesQuery)
    console.log(rows)
    res.send(rows);
});

router.get('/likes_fromUsers', async (req, res) => {
    //임의로 user_pk를 정했고, 로그인과 연동이되면 거기에서 get을 쏴서 user_pk 받아올 예정
    //3대신에 user_pk가 들어가야겠지
    const rows = await db.query(likesQuery + '3')
    console.log(rows)
    res.send(rows);
});

router.post('/likes', async (req, res) => {
    console.log(req.body);
    const {like_type, like_title, like_location, like_score} = req.body;
    //회원가입 때 날아온 user_pk를 넣어줘야한다
    const result = await db.query('insert into likes(like_type, user_pk, like_title, like_location, like_score) values (?, 3, ?, ?, ?);', [like_type, like_title, like_location, like_score]);
    console.log(result)
})

router.delete('/likes/:like_pk', async (req, res) => {
    var sql = 'delete from likes where like_pk=\''+req.params.like_pk+'\'';
    await db.query(sql)
})

module.exports = router;