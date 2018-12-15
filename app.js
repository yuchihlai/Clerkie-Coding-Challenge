const express = require('express');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();

mongoose.Promise = global.Promise;
// connect to monogodb
mongoose.connect('mongodb://localhost/interview_challenge', {useNewUrlParser: true });
mongoose.connection.once('open', function(){
  console.log('connection with mongodb has been made');
}).on('error', function(error){
  console.log(error);
});

app.use(bodyParser.json());

// initialize routes
app.use(routes);

// error handling
app.use(function(err, req, res, next){
  res.status(422).send({error: err.message});
});

// Listen for requests
app.listen(process.env.port || 1984, function(){
  console.log('now listening for port 1984');
});
