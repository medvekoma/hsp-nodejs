var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();

// domain error handling
app.use(require('./domainError'));

// set up handlebars view engine
var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

switch (app.get('env')) {
case 'development':
    // compact, colorful dev logging
    app.use(require('morgan')('dev'));
    break;
case 'production':
    // daily log rotation
    app.use(require('express-logger')({
        path: __dirname + '/log/requests.log'
    }));
    break;
}

//app.use(function (req, res, next) {
//    var cluster = require('cluster');
//    if (cluster.isWorker) console.log('Worker %d received request',
//    cluster.worker.id);
//});

app.get('/newsletter', function (req, res) {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.post('/process', function (req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
});
app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about');
});

var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
var connectionString = process.env.MONGOLAB_URI;
var result = mongoose.connect(connectionString, opts);

var Championship = require('./models/championship.js');

app.get('/championships', function (req, res) {

    Championship.find(function(err, championships) {
        var context = {
            championships: championships.map(function (championship) {
                return {
                    name: championship.name,
                    location: championship.location,
                }
            })
        };
        res.render('championships', context);
    });
});

app.get('/fail', function (req, res) {
    throw new Error('Nope!');
});

app.get('/epic-fail', function (req, res) {
    process.nextTick(function () {
        throw new Error('Kaboom!');
    });
});

// custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

function startServer() {
    http.createServer(app).listen(app.get('port'), function() {
        console.log('Express started in ' + app.get('env') + ' mode on http://localhost:' +
            app.get('port') + '; press Ctrl-C to terminate.');
    });
}

if (require.main === module) {
    // application run directly; start app server
    startServer();
} else {
    // app imported as module
    module.exports = startServer;
}

//app.listen(app.get('port'), function () {
//    console.log('Express started in ' + app.get('env') + ' mode on http://localhost:' +
//        app.get('port') + '; press Ctrl-C to terminate.' );
//});