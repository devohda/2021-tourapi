const express = require('express');
const router = express.Router();

const twilioConfig = require('../config/twilio')
const {authToken, accountSid} = twilioConfig
const client = require('twilio')(accountSid, authToken);

const authService = require('../services/authService')

// 본인인증 - 휴대폰 인증 sms 보내기
router.post('/authPhone', async (req, res) => {
    // TODO 인증번호 생성해서 같이 send 하기
    const result = await client.messages
        .create({
            body: `[히든쥬얼] 본인 확인을 위한 인증번호는 389174 입니다.`,
            from: '+18637346757',
            to: '+821023103703'
        })
        .then(message => {
            console.log(message.sid)
            return message
        })
        .catch(error => {
            console.log(error)
            return error
        });

    res.send({state: 'SUCCESS'})
});

router.post('/makeAccount', async (req, res, next) => {
    const {userInfo} = req.body;
    const result = await authService.addUser(userInfo);
    res.send(result);
})

router.post('/sameEmail', async (req, res, next) => {
    const {email} = req.body;
    const [{count}] = await authService.findUser(email);

    let isDuplicated = false;
    if (count >= 1) {
        isDuplicated = true;
    }
    res.send({isDuplicated})
})

module.exports = router;




