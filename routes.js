var Championship = require('./models/championship.js');

module.exports = function (app) {
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
    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/about', function (req, res) {
        res.render('about');
    });

    var mongo = require('./mongo.js')();
    mongo.connect();

    app.get('/championships', function (req, res) {

        Championship.find(function (err, championships) {
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
    app.use(function (req, res) {
        res.status(404);
        res.render('404');
    });

    // custom 500 page
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500);
        res.render('500');
    });
};