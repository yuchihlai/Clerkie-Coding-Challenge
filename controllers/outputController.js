module.exports = function(data, period){
  // the most recent recurring transaction
  var recent = data[data.length - 1];

  // estimated date of the next transaction
  var date = new Date(recent.date);
  if(period === 7) date.setDate(date.getDate() + 7);
  if(period === 30) date.setMonth(date.getMonth() + 1);

  // all transactions that are part of this recurring transaction group(array of transactions)
  var trans = [];
  data.forEach(function(each){
    tran = {"trans_id": each.trans_id, "user_id": each.user_id, "name": each.name, "amount": each.amount, "date": each.date};
    trans.push(tran);
  });

  // an array containing this recurring transaction
  var output = { "name": tran.name, "user_id": tran.user_id, "next_amt": tran.amount, "next_date": date, "transactions": trans};
  return output;
}
