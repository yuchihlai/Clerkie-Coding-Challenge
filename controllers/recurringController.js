const HashMap = require('hashmap');
const outputController = require('./outputController');
const Transaction = require('../models/Transaction');

module.exports = function(data){

  var output = [];

  // retrieve the transactions with the same company name, user id and amount
  // TODO: company name may be different, ex: Netflix 20180901 vs. Netflix 20180801
  // TODO: amount can be slightly different, ex: $50 vs. $49.99
  var map = new HashMap();
  data.forEach(function(transaction){
    var key = [transaction.name, transaction.user_id, transaction.amount];
    if(!map.has(key)) map.set(key, []);
    map.get(key).push(transaction);
  });

  // TODO: transactions may also recur every two weeks, every three months, or every year
  // retrieve the transactions with recurring every once a week
  var week = new HashMap();
  map.forEach(function(value, key){
    // sort with date
    var arr = map.get(key).sort((a, b) => new Date(a.date) - new Date(b.date));
    for(var i = 1; i < arr.length; i++){
      for(var j = i - 1; j >= 0; j--){
        var date1 = arr[i].date;
        var date2 = arr[j].date;
        var y = date1.getYear() - date2.getYear();
        var m = date1.getMonth() - date2.getMonth();
        var d = date1.getDate() - date2.getDate();
        if(y === 0 && m <= 1 && d === 7){
            if(!week.has(key)) week.set(key, []);
            if(week.get(key).length === 0) week.get(key).push(arr[j]);
            week.get(key).push(arr[i]);
        }
      }
    }
  });
  week.forEach(function(value, key){
    // a recurring transaction happening every once a week lasts more than three times
    if(week.get(key).length >= 3){
      week.get(key).forEach(function(tran){
        // update the database to make the transaction's is_recurring true
        Transaction.findOneAndUpdate({trans_id: tran.trans_id}, {is_recurring: true}).then(function(){});
      });
      output.push(outputController(week.get(key), 7));
    }
  });

  // retrieve the transactions with recurring every once a month
  var month = new HashMap();
  map.forEach(function(value, key){
    var arr = map.get(key).sort((a, b) => new Date(a.date) - new Date(b.date));
    for(var i = 1; i < arr.length; i++){
      for(var j = i - 1; j >= 0; j--){
        var date1 = arr[i].date;
        var date2 = arr[j].date;
        var y = date1.getYear() - date2.getYear();
        var m = date1.getMonth() - date2.getMonth();
        var d = date1.getDate() - date2.getDate();
        if(y === 0 && m === 1 && d === 0){
            if(!month.has(key)) month.set(key, []);
            if(month.get(key).length === 0) month.get(key).push(arr[j]);
            month.get(key).push(arr[i]);
        }
      }
    }
  });
  month.forEach(function(value, key){
    if(month.get(key).length >= 3){
      month.get(key).forEach(function(tran){
        Transaction.findOneAndUpdate({trans_id: tran.trans_id}, {is_recurring: true}).then(function(){});
      });
      output.push(outputController(month.get(key), 30));
    }
  });

  // an array containing all of the users' recurring transactions in alphabetical order(sorted by name)
  var sortOutput = output.sort((a, b) => a.name.localeCompare(b.name));
  return sortOutput;
};
