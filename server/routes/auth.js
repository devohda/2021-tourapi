const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const twilioConfig = require('../config/twilio');
const {authToken, accountSid} = twilioConfig;
const client = require('twilio')(accountSid, authToken);

const authService = require('../services/authService');

const {verifyToken} = require('../middleware/jwt');

const NodeCache = require('node-cache');
const cache = new NodeCache({stdTTL: 180});
const jwtDecode = require('jwt-decode')
const {JwtHeader} = require('jwt-decode');

// [POST]
// 본인인증 - 휴대폰 인증 sms 보내기
router.post('/authPhone', async (req, res) => {
    const {phoneNumber} = req.body;
    console.log(phoneNumber);

    // 기존에 저장되어 있던 캐시는 만료 시키기
    cache.del(phoneNumber);

    // 인증번호 생성
    let verifyCode = "";
    for (let i = 0; i < 6; i++) {
        verifyCode += parseInt(Math.random() * 10);
    };

    // 캐시에 저장
    cache.set(phoneNumber, verifyCode);

    const result = await client.messages
        .create({
            body: `[히든쥬얼] 본인 확인을 위한 인증번호는 ${verifyCode} 입니다.`,
            from: '+18453933193',
            to: phoneNumber
        })
        .then(message => {
            return message;
        })
        .catch(error => {
            console.log(error);
            return error;
        });

    return res.status(200).json({
        code: 200,
        status: 'OK'
    });
});

// 본인인증 - 코드 보내고 인증하기
router.post('/authPhoneCode', async (req, res, next) => {
    const {phoneNumber, verifyCode} = req.body;
    console.log(phoneNumber);
    console.log(verifyCode);

    const cacheData = cache.get(phoneNumber);
    console.log(cacheData);

    if (!cacheData) {
        return res.status(400).json({
            code: 400,
            status: 'INVALID'
        });
    }

    if (cacheData != verifyCode) {
        return res.status(400).json({
            code: 400,
            status: 'INVALID'
        });
    }

    cache.del(phoneNumber);
    return res.status(200).json({
        code: 200,
        status: 'OK'
    });
})

// 회원가입
router.post('/account', async (req, res, next) => {
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

    const {password, salt} = await createHashedPassword(userInfo.password);
    userInfo.password = password;
    userInfo.salt = salt;

    const result = await authService.createUser(userInfo);
    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
});

// 회원가입 시 중복 확인 - 이메일
router.post('/sameEmail', async (req, res, next) => {
    const {email} = req.body;
    const [{count}] = await authService.readUserCntByEmail(email);

    let isDuplicated = false;
    if (count >= 1) {
        isDuplicated = true;
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data: {isDuplicated}
    });
});

// 회원가입 시 중복 확인 - 이메일
router.post('/sameNickname', async (req, res, next) => {
    const {nickname} = req.body;
    const [{count}] = await authService.readUserCntByNickname(nickname);

    let isDuplicated = false;
    if (count >= 1) {
        isDuplicated = true;
    }

    return res.status(200).json({
        code: 200,
        status: 'OK',
        data: {isDuplicated}
    });
});

// jwt 토큰을 이용한 로그인
router.post('/loginJWT', async (req, res, next) => {
    try {
        const {email, password: plainPassword} = req.body.user;

        // 유저 정보 확인
        const userData = await authService.readUserByEmail(email);

        // [1] 해당 유저 정보 없음.
        if (userData.length !== 1) {
            return res.status(404).json({
                code: 404,
                status: 'NOT EXIST'
            });
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
            return res.status(403).json({
                code: 403,
                status: 'NOT MATCHED'
            });
        }

        // jwt 토큰 발급.
        const accessToken = await authService.createToken(user);

        return res.status(200).json({
            code: 200,
            status: 'OK',
            accessToken: accessToken
        });
    } catch (err) {
        console.log(err)
        return res.status(501).json({
            code: 501,
            status: 'SERVER ERROR'
        });
    }
});

// apple 로그인
router.post('/loginApple', async (req, res, next) => {
    try {
        const {user, email, password: plainPassword, nickname, token} = req.body.userInfo;

        console.log({
            user,
            email,
            plainPassword,
            nickname,
            token
        })
        // 토큰 풀기


        // 회원가입 절차
        if (email && nickname) {
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

            const {password, salt} = await createHashedPassword(plainPassword);

            const userData = {
                user_email: email,
                user_nickname: `${nickname.familyName} ${nickname.givenName}`,
                user_password: password,
                salt: salt,
                apple_name: user
            }
            const result1 = await authService.createUserApple(userData);
            console.log(result1);
        }

        // 유저 정보 확인
        const userData = await authService.readUserByAppleName(user);
        console.log(userData);

        // [1] 해당 유저 정보 없음.
        if (userData.length !== 1) {
            return res.status(404).json({
                code: 404,
                status: 'NOT EXIST'
            });
        }

        // jwt 토큰 발급.
        const accessToken = await authService.createToken(userData[0]);

        return res.status(200).json({
            code: 200,
            status: 'OK',
            accessToken: accessToken
        });
    } catch (err) {
        console.log(err)
        return res.status(501).json({
            code: 501,
            status: 'SERVER ERROR'
        });
    }
})

// [PUT]
// 비밀번호 재설정
router.put('/password', async (req, res, next) => {
    const {email, password: plainPassword} = req.body;

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

    const {password, salt} = await createHashedPassword(plainPassword);

    const result = await authService.updatePassword(email, password, salt);
    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

// [DELETE]
// 로그아웃
router.delete('/logout', verifyToken, async (req, res, next) => {
    const {user} = res.locals;
    await authService.deleteToken(user.user_pk);

    return res.status(200).json({
        code: 200,
        status: 'OK'
    });
});

// 회원 탈퇴
router.delete('/account', verifyToken, async (req, res, next) => {
    const {user} = res.locals;
    const result = await authService.deleteUser(user.user_pk);
    if (result) {
        return res.status(200).json({
            code: 200,
            status: 'OK'
        });
    } else {
        return res.status(500).json({
            code: 500,
            status: 'SERVER ERROR'
        });
    }
})

module.exports = router;




