const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = `mongodb://localhost:27017/${process.env.DBNAME}`;

const db = mongoose.connect(mongoURI);

db
  .then(db => console.log(`Connected to: ${mongoURI}`))
  .catch(err => {
    console.log(`There was a problem connecting to mongo at: ${mongoURI} :`, err);
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

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/${process.env.DBNAME}`)
    .then(() => console.log('database connected'))
    .catch(error => console.log('error connecting database', error));
};

// wouldn't I need to return the response from main to be able to catch any errors from its call on line 30
// or is main like a function class and then catch is one of its methods that we are calling?



