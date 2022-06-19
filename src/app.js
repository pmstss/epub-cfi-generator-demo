const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const multer = require('multer');
const EpubCfiGenerator = require('epub-cfi-generator');

const app = express();
const VERSION = 'v0.1.0';
const epubCfiGenerator = new EpubCfiGenerator();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', multer({ dest: './uploads/' }).single('epub'), (req, res) => {
  if (req.file) {
    epubCfiGenerator.parse(req.file.path, false).then((data) => {
      res.render('upload', {
        version: VERSION,
        data: JSON.stringify(data, null, 4)
      });
    }, (err) => {
      res.render('error', {
        message: err,
        error: 500
      });
    });
  } else {
    res.redirect('index');
  }
});

app.use('/index', (req, res) => {
  res.render('index', {
    version: VERSION
  });
});

app.use('/', (req, res) => {
  res.redirect('index');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
