const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create transaction schemma & model
const TransactionSchema = new Schema({
  trans_id: {
    type: String,
    required: [true, 'trans_id field is required']
  },
  user_id: {
    type: String,
    required: [true, 'user_id field is required']
  },
  name: {
    type: String,
    required: [true, 'name field is required']
  },
  amount: {
    type: Number,
    required: [true, 'amount field is required']
  },
  date: {
    type: Date,
    required: [true, 'date field is required']
  },
  is_recurring: {
    type: Boolean,
    default: false
  }
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
