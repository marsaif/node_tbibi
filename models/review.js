var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var Review = new Schema({
    rating:Number,
    Date : String,
    description: String,
    patient :
        { type: Schema.Types.ObjectId, ref: 'users' },
    doctor : 
        { type: Schema.Types.ObjectId, ref: 'users' } 
});

module.exports = mongoose.model('reviews', Review);