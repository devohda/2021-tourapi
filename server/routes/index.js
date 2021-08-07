const express = require('express');
var Collections = require('./collections');

const router = express.Router();

router.use('/collections', Collections);


module.exports = router;