const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
const helmet = require('helmet');
const hpp = require('hpp');

const app = express();
const router = require('./routes/index');
const logger = require('./logger');

// 배포 환경에서는 'combined' 개발 환경에서는 'dev'
if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'));
  app.use(helmet({contentSecurityPolicy : false}));
  app.use(hpp());
}else{
  app.use(morgan('dev'));
}


app.use(express.json());
app.use('/', router);

// 404 처리
app.use((req, res, next) => {
  const error = new Error(`[${req.method}] ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  logger.error(error.message);
  next(error);
  // next(createError(404))
})

// error 처리
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.error(err)

  res.status(err.status || 500).send(err);
})

module.exports = app;