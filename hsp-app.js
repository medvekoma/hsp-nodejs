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

require('./routes.js')(app);

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