const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        if(!token){
            return res.status(401).json({
                code: 401,
                status: 'UNAUTHORIZED'
            });
        }

        const isTokenVerified = jwt.verify(token, process.env.JWT_SECRET);
        const decodedToken = jwt.decode(token);
        if(isTokenVerified){
            const [{access_token}] = await authService.readUserTokenByUserPk(decodedToken.user_pk);

            if(access_token === token){
                res.locals.user = decodedToken;
                return next();
            }else{
                // 중복 로그인
                return res.status(405).json({
                    code: 405,
                    status: 'DUPLICATE'
                });
            }
        }else{
            // 유효하지 않으면 토큰 삭제
            return res.status(403).json({
                code: 403,
                status: 'INVALID TOKEN'
            });
        }
    } catch (err) {
        // 유효 기간 초과
        if (err.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: 'EXPIRED TOKEN'
            });
        }

        // 유효하지 않으면 토큰 삭제
        return res.status(403).json({
            code: 403,
            status: 'INVALID TOKEN'
        });
    }
};