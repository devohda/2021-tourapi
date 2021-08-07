const express = require('express')
const createError = require('http-errors')

const app = express();

const router = require('./routes/index');
app.use('/', router);

// 404 처리
app.use((req, res, next) => {
  next(createError(404))
})

// error 처리
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.error(err)

  res.status(err.status || 500).send(err);
})

module.exports = app;