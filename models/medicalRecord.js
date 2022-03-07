var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var MedicalRecord = new Schema({
    DateCreation : Date,
    patient :
        { type: Schema.Types.ObjectId, ref: 'users' },
    doctor : 
        { type: Schema.Types.ObjectId, ref: 'users' } ,
    pastMedicalHistory : [String] ,
    familyHistory : [String] , 
    MaritalStatus : String ,
    currentMedications : [String] 
});

module.exports = mongoose.model('medicalRecords', MedicalRecord);