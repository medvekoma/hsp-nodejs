var mongoose = require('mongoose');

var championshipSchema = mongoose.Schema({
    name: String,
    location: String,
    date: Date,
    information: [{ name: String, url: String }],
    results: [{ name: String, url: String }]
});

module.exports = mongoose.model('championship', championshipSchema);
