var mongoose = require('mongoose');

var championshipSchema = mongoose.Schema({
    name: String,
    location: String,
});

module.exports = mongoose.model('championship', championshipSchema);
