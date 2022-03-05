var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var Review = new Schema({
    Date : String,
    description: String,
});

module.exports = mongoose.model('reviews', Review);