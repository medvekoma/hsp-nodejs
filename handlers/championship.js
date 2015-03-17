var dateFormat = require('dateformat');
var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};

var connectionString = process.env.MONGOLAB_URI;
mongoose.connect(connectionString, opts);
var ChampionshipModel = require('../models/championship.js');

exports.list = function (req, res) {
    //exports.create(req, res);
    ChampionshipModel.find(function(err, championships) {
        var context = {
            championships: championships.map(function(championship) {
                return {
                    date: dateFormat(championship.date, "yyyy.mm.dd."),
                    name: championship.name,
                    location: championship.location,
                    information: championship.information,
                    results: championship.results
                }
            })
        };
        res.render('championships', context);
    });
};

exports.create = function(req, res) {
    var ch1 = {
        name: 'Margitsziget kupa (3Sz)',
        location: 'Margitsziget',
        date: new Date(2015, 3, 4),
        information: [
            { name: 'Kiírás', url: 'http://mtfsz.hu/versenyinfo/10254_i_3Sz3_Margitsziget_Kiiras.pdf' },
            { name: 'Értesítő', url: 'http://mtfsz.hu/versenyinfo/10264_i_3Sz3_Margitsziget_Ertesito.pdf' },
        ],
        results: [
            { name: 'Eredmények', url: 'http://mtfsz.hu/versenyinfo/9036_e_Eredmenyek_SI.html' },
            { name: 'Részidők', url: 'http://mtfsz.hu/versenyinfo/9037_e_Eredmenyek_SI_reszidos.html' },
        ]
    };
    new ChampionshipModel(ch1).save();
    var ch2 = {
        name: 'Hidegkút kupa (3Sz)',
        location: 'Vadaskert',
        date: new Date(2015, 5, 6),
        information: [
            { name: 'versenynaptár', url: 'http://mtfsz.hu/megjelenites/versenynaptar/showevent.php?event=5992' }
        ]
    };
    new ChampionshipModel(ch2).save();
}