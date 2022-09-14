const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = `mongodb://localhost:27017/${process.env.DBNAME}`;

const db = mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

db
  .then(db => console.log(`Connected to: ${mongoURI}`))
  .catch(err => {
    console.log(`There was a problem connecting to mongo at: ${mongoURI}`);
    console.log(err);
  });

module.exports = db;

// taken from https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose :
  // mongoose.connect(process.env.DBNAME, { useNewUrlParser: true, useUnifiedTopology: true })
    // because want to connect db first, could maybe set this up in same module as set up express server
  //   .then(() => app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`)))
  //  .catch(err => console.log(err))

  // const db = mongoose.connection;

  // db.on('error', console.error.bind(console, 'MongoDB connection error:'));



// taken from mongoose quick start:

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect(`mongodb://localhost:27017/${process.env.DBNAME}`);
    // .then(() => console.log('database connected'))
    // .catch(error => console.log('error connecting database', error));


// define schemas and create models

// test
//   var testPost = new Test({testTitle: 'test title value', testDescription: 'to be alone test description'});

//   testPost.save();

//   console.log('title of test post: ', testPost.testTitle);

//    // Test model
//    const tests = Test.find();
//    console.log('tests:', tests);

//  modelTest = Test.inspect();
//  console.log('modelTest: ', modelTest);
// };



