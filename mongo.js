var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};

function connect() {
    var connectionString = process.env.MONGOLAB_URI;
    mongoose.connect(connectionString, opts);
};

function mongo() {
    return {
         connect: connect
    };
}

module.exports = mongo;
