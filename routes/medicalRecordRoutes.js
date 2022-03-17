var express = require('express');
var router = express.Router();
const User = require('../models/user');
const medicalRecord = require('../models/medicalRecord');
const { AuditLogBlockchain } = require('../models/chain');
const logger = require('elogger');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'aaaaaa' });
});

/* router.post("/",function(req, res, next) {
  
  const appo = new medicalRecord({ pastMedicalHistory: req.body.pastMedicalHistory });
  appo.save().then(() => console.log('meow'));
  res.send('nice');
}); */


router.post("/", function (req, res, next) {

  (async () => {
    let blockChain = new AuditLogBlockchain();
    await blockChain.initialize();
    const medRec = new medicalRecord(

      {
        familyHistory: req.body.data.familyhistory,
        currentMedications: req.body.data.medsList,
        AllergiesReactionstoTreatment: req.body.data.allergies,
        CurrentMedicalConditions: req.body.data.CurrentMedicalConditions,
        created_on: new Date().getTime(),
        DateCreation: new Date(),
        patient: req.body.patient
        //mezel attribut mtaa tbib eli 3amel login 
      });

    logger.info(`New Block Request: ${medRec._id}`);
    let entry = await blockChain.createTransaction(medRec);
    logger.info(`New Transaction: ${entry.id}`);


    let status = await blockChain.checkChainValidity();
    logger.info(`Chain Status: ${(status) ? 'SUCCESS' : 'FAILED'}`);

  })();

});

module.exports = router;
