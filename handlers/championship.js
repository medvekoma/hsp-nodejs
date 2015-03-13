var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};

var connectionString = process.env.MONGOLAB_URI;
mongoose.connect(connectionString, opts);
var championshipModel = require('../models/championship.js');

exports.list = function(req, res) {
    championshipModel.find(function(err, championships) {
        var context = {
            championships: championships.map(function(championship) {
                return {
                    name: championship.name,
                    location: championship.location,
                }
            })
        };
        res.render('championships', context);
    });
};