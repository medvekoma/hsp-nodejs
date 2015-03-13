exports.home = function(req, res) {
    res.render('home');
};

exports.about = function (req, res) {
    res.render('about');
};

exports.newsletter = function(req, res) {
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
};

exports.process = function(req, res) {
    if (req.xhr || req.accepts('json,html') === 'json') {
        // if there were an error, we would send { error: 'error description' }
        res.send({ success: true });
    } else {
        // if there were an error, we would redirect to an error page
        res.redirect(303, '/thank-you');
    }
};

exports.fail = function(req, res) {
    throw new Error('Nope!');
};

exports.epicFail = function(req, res) {
    process.nextTick(function() {
        throw new Error('Kaboom!');
    });
};

