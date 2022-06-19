var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var multer = require('multer');
var EpubCfiGenerator = require('epub-cfi-generator');

var app = express();
var VERSION = 'v0.1.0';
var epubCfiGenerator = new EpubCfiGenerator();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', multer({ dest: './uploads/'}).single('epub'), function(req, res){
    if (req.file) {
        epubCfiGenerator.parse(req.file.path, false).then(function (data) {
            res.render('upload', {
                version: VERSION,
                data: JSON.stringify(data, null, 4)
            });
        }, function (err) {
            console.error('error: %s', JSON.stringify(arguments));
            res.render('error', {
                message: err,
                error: 500
            });
        });
    } else {
        res.redirect('index');
    }
});

app.use('/index', function (req, res) {
    res.render('index', {
        version: VERSION
    });
});

app.use('/', function (req, res) {
    res.redirect('index');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
