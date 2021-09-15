const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    try{
        req.decoded = jwt.verify(req.header.authorization, process.env.JWT_SECRET);
        return next();
    }catch (err){
        if(err.name === 'TokenExpiredError'){
            return res.status(419).json({
                code : 419,
                message : '토큰 만료'
            });
        }
        return res.status(401).json({
            code : 401,
            message : '유효하지 않은 토큰'
        });
    }
};