const jwt = require('jsonwebtoken');
const {cat} = require("yarn/lib/cli");

exports.verifyToken = (req, res, next) => {
    try{
        req.decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    }catch(error){
        if(error.name === 'TokenExpiredError'){ // 유효 기간 초과
            return res.status(419).json({
                code : 419,
                message : '토큰이 만료되었습니다',
            });
        }

        return res.status(401).json({
            code : 401,
            message : '유효하지 않은 토큰입니다'
        })
    }
}