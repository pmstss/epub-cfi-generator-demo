var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var multer = require('multer');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.files);
    res.render('upload', {data: JSON.stringify(req.files, null, 4)});
}]);

app.use('/index', function (req, res) {
    res.render('index', {param: 'value'});
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
