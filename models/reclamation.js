var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var Reclamation = new Schema({
    date : String,
    description: String,
    patient:
        {type: Schema.Types.ObjectId, ref: 'users'}
      

});

module.exports = mongoose.model('reclamations', Reclamation);