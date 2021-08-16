const express = require('express');
const router = express.Router();

const db = require('../database/database');
const { getUsersQuery, getUsersPKQuery, postUsersQuery } = require('../models/users');

router.get('/users', async (req, res) => {
    const rows = await db.execute(getUsersQuery)
    console.log(rows)
    res.send(rows);
});

router.get('/users_pk', async (req, res) => {
    const rows = await db.execute(getUsersPKQuery)
    console.log(rows)
    res.send(rows);
});

router.post('/users/:user_nickname', async (req, res) => {
    const rows = await db.execute(postUsersQuery)
    // console.log(rows)
    // res.send(rows);
});



module.exports = router;