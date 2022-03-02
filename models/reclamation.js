var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var Reclamation = new Schema({
    Date : String,
});

module.exports = mongoose.model('reclamations', Reclamation);