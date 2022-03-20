var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./database/db.json');
var cors = require('cors')
var io = require('./socket')

const passport = require('passport')
require('dotenv').config()

mongoose.connect(
  config.mongo.uri,
  ()=> { console.log("Connected to DATABASE")});
  
var indexRouter = require('./routes/indexRoutes');
var usersRouter = require('./routes/usersRoutes');
var appointmentsRouter = require('./routes/appointmentsRoutes');
var reclamationRouter = require('./routes/reclamationsRoutes');
var reviewRouter = require('./routes/reviewsRoutes');
var medicalRecordRouter = require('./routes/medicalRecordRoutes');
var PaymentRoutes = require('./routes/PaymentRoutes');


var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/appointments",appointmentsRouter)
app.use("/reviews",reviewRouter)
app.use("/reclamations",reclamationRouter)
app.use("/medicalrecord",medicalRecordRouter)
app.use("/payments",PaymentRoutes)


app.use(passport.initialize())
require('./security/passport')(passport)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
