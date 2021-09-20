const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const twilioConfig = require('../config/twilio');
const {authToken, accountSid} = twilioConfig;
const client = require('twilio')(accountSid, authToken);

const authService = require('../services/authService');

const {verifyToken} = require('../middleware/jwt');

/*
* 비밀번호 찾기
*
*
* */

// 본인인증 - 휴대폰 인증 sms 보내기
router.post('/authPhone', async (req, res) => {
    // TODO 인증번호 생성해서 같이 send 하기
    const result = await client.messages
        .create({
            body: '[히든쥬얼] 본인 확인을 위한 인증번호는 389174 입니다.',
            from: '+18637346757',
            to: '+821023103703'
        })
        .then(message => {
            console.log(message.sid);
            return message;
        })
        .catch(error => {
            console.log(error);
            return error;
        });

    res.send({state: 'SUCCESS'});
});


/*
* 회원가입
*
*
* */

// 회원가입
router.post('/makeAccount', async (req, res, next) => {
    const {userInfo} = req.body;

    const createSalt = () =>
        new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, buf) => {
                if (err) reject(err);
                resolve(buf.toString('base64'));
            });
        });

    const createHashedPassword = (plainPassword) =>
        new Promise(async (resolve, reject) => {
            const salt = await createSalt();
            crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
                if (err) reject(err);
                resolve({password: key.toString('base64'), salt});
            });
        });

    const {password, salt} = await createHashedPassword(userInfo.user_password);
    userInfo.user_password = password;
    userInfo.salt = salt;

    const result = await authService.createUser(userInfo);
    res.send({result: true});
});

// 회원가입 시 중복 확인 - 이메일
router.post('/sameEmail', async (req, res, next) => {
    const {email} = req.body;
    const [{count}] = await authService.readUserCntByEmail(email);

    let isDuplicated = false;
    if (count >= 1) {
        isDuplicated = true;
    }
    res.send({code: 200, status: 'SUCCESS', data: {isDuplicated}});
});

// 회원가입 시 중복 확인 - 이메일
router.post('/sameNickname', async (req, res, next) => {
    const {nickname} = req.body;
    const [{count}] = await authService.readUserCntByNickname(nickname);

    let isDuplicated = false;
    if (count >= 1) {
        isDuplicated = true;
    }
    res.send({code: 200, status: 'SUCCESS', data: {isDuplicated}});
});


/*
* 로그인
*
*
* */

router.post('/loginEmail', async (req, res, next) => {
    const {email, password: plainPassword} = req.body.user;

    const userData = await authService.readUserByEmail(email);
    if (userData.length !== 1) {
        return res.send({state: 'NOT EXIST'});
    }

    const {salt, user_password, ...user} = userData[0];

    const makePasswordHashed = (plainPassword) =>
        new Promise(async (resolve, reject) => {
            // salt를 가져오는 부분은 각자의 DB에 따라 수정
            crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
                if (err) reject(err);
                resolve(key.toString('base64'));
            });
        });

    const password = await makePasswordHashed(plainPassword);

    if (user_password !== password) {
        return res.send({state: 'NOT MATCHED'});
    }

    return res.send({state: 'SUCCESS', userData: user});
});

// jwt 토큰을 이용한 로그인
router.post('/loginJWT', async (req, res, next) => {
    try {
        const {email, password: plainPassword} = req.body.user;

        // 유저 정보 확인
        const userData = await authService.readUserByEmail(email);

        // [1] 해당 유저 정보 없음.
        if (userData.length !== 1) {
            return res.send({state: 'NOT EXIST'});
        }


        // 비밀번호 일치 확인
        const {salt, user_password, ...user} = userData[0];
        const makePasswordHashed = (plainPassword) =>
            new Promise(async (resolve, reject) => {
                // salt를 가져오는 부분은 각자의 DB에 따라 수정
                crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
                    if (err) reject(err);
                    resolve(key.toString('base64'));
                });
            });

        const password = await makePasswordHashed(plainPassword);

        // [2] 비밀번호 일치 하지 않음.
        if (user_password !== password) {
            return res.send({state: 'NOT MATCHED'});
        }

        // jwt 토큰 발급.
        const accessToken = await authService.createToken(user);

        return res.send({code: 200, state: 'SUCCESS', accessToken});
    } catch (err) {
        return res.send({code: 501, state: 'SERVER ERROR'});
    }
});

router.delete('/logout', verifyToken, async (req, res, next)=> {
    const {user} = res.locals;
    await authService.deleteToken(user.user_pk);

    return res.send({code: 200, state: 'SUCCESS'});

});

module.exports = router;




