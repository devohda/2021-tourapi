const express = require('express');
const router = express.Router();

const twilioConfig = require('../config/twilio')
const client = require('twilio')(...twilioConfig);

// 본인인증 - 휴대폰 인증 sms 보내기
router.get('/authPhone', async (req, res) => {
    client.messages
        .create({
            body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
            from: '+18637346757',
            to: '+821023103703'
        })
        .then(message => console.log(message.sid))
        .catch(error => console.log(error));
});

module.exports = router;




