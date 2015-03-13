var mainHandler = require('./handlers/main.js');
var championshipHandler = require('./handlers/championship.js');

module.exports = function (app) {
    app.get('/', mainHandler.home);
    app.get('/about', mainHandler.about);
    app.get('/newsletter', mainHandler.newsletter);
    app.post('/process', mainHandler.process);
    app.get('/fail', mainHandler.fail);
    app.get('/epic-fail', mainHandler.epicFail);

    app.get('/championships', championshipHandler.list);

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