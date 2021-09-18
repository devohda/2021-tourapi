const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if(!token){
            return res.status(403).json({
                code: 403,
                message: '로그인하지 않은 유저'
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(decodedToken){
            const [access_token] = await authService.readUserTokenByUserPk(decodedToken.user_pk);
            if(access_token === token){
                res.locals.user = decodedToken.user;
                return next();
            }else{
                return res.status(401).json({
                    code: 401,
                    message: '유효하지 않은 토큰'
                });
            }
        }
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