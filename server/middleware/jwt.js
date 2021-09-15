const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

exports.verifyToken = async (req, res, next) => {
    try {
        const {tokens} = req.cookies;
        const decodedAccessToken = jwt.verify(tokens.accessToken, process.env.JWT_SECRET);
        if(decodedAccessToken){
            const savedTokens = await authService.readUserTokenByUserPk(decodedAccessToken.user_pk);
            if(savedTokens.accessToken === tokens.accessToken && savedTokens.refreshToken === tokens.refreshToken){
                res.locals.user = decodedAccessToken.user;
            }else{
                return res.status(401).json({
                    code: 401,
                    message: '유효하지 않은 토큰'
                });
            }
        }else{
            const decodedRefreshToken = jwt.verify(tokens.refreshToken, process.env.JWT_SECRET);
            if(decodedRefreshToken){
                const savedTokens = await authService.readUserTokenByUserPk(decodedAccessToken.user_pk);
                if(savedTokens.accessToken === tokens.accessToken && savedTokens.refreshToken === tokens.refreshToken){
                    // refresh token 의 유효시간 = 200days
                    const refreshToken = jwt.sign(decodedRefreshToken.user, process.env.JWT_SECRET, {expiresIn: 17280000000, issuer: 'here'});

                    // access token 의 유효시간 = 30 minutes
                    const accessToken = jwt.sign(decodedRefreshToken.user, process.env.JWT_SECRET, {expiresIn: 1800000, issuer: 'here'});


                }else{
                    return res.status(401).json({
                        code: 401,
                        message: '유효하지 않은 토큰'
                    });
                }
            }else{
                return res.status(401).json({
                    code: 401,
                    message: '유효하지 않은 토큰'
                });
            }
        }
        return next();
    } catch (err) {

        // 유효 기간 초과
        if (err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰 만료'
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰'
        });
    }
};