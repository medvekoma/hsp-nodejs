var mongoose = require('mongoose');

var championshipSchema = mongoose.Schema({
    name: String,
    location: String,
});

var Championship = mongoose.model('championship', championshipSchema);
module.exports = Championship;
