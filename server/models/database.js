const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://gursulkol:Zkjk1272@cluster0.h6cgqbb.mongodb.net/test", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected')
});

// Models
require('./Category');
require('./Device');