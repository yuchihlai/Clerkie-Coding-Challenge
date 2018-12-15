const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const recurringController = require('../controllers/recurringController');

router.get('/', function(req, res, next){
  // find all recurring data
  Transaction.find({is_recurring: true}).then(function(recurs){
    var recurringData = recurringController(recurs);
    res.send(recurringData);
  }).catch(next);
});

router.post('/', function(req, res, next){
  // get all the transactions in the database, cuz some nonrecurring
  // transactions may become recurring after adding new transactions
  Transaction.find().then(function(trans){
    var dataInDb = [];
    trans.forEach(function(tran){
      dataInDb.push(tran);
    });
    // save data to the database
    Transaction.create(req.body).then(function(data){
      // combine all the transactions in the database with data
      dataInDb.forEach(function(tranInDb){
        data.push(tranInDb);
      });
      var recurringData = recurringController(data);
      res.send(recurringData);
    });
  }).catch(next);
});

module.exports = router;
