var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicalRecord = new Schema({
    DateCreation: Date,
    patient:
        { type: Schema.Types.ObjectId, ref: 'users' },
    doctor:
        { type: Schema.Types.ObjectId, ref: 'users' },
    familyHistory: String,
    CurrentMedicalConditions: String,
    currentMedications: [String],
    AllergiesReactionstoTreatment: String,
    created_on: { type: Number }

});

module.exports = mongoose.model('MedicalRecords', MedicalRecord);