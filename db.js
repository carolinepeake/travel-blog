const mongoose = require("mongoose");
require("dotenv").config();

// mongoose.connect(`mongodb://localhost:27017/${process.env.DBNAME}`)
//   .then(() => console.log('database connected'))

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`)))
 .catch(err => console.log(err))

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const { Schema } = mongoose;

const Posts = new Schema({
  title: String,
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  location: {type: mongoose.Schema.Types.ObjectId, ref: 'Location'},
  description: String,
  photos: [String],
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  created_at: { type: Date, default: Date.now() }
});

const Tags = new Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

const Locations = new Schema({
  city: {type: 'string', unique: false},
  state: {type: 'string', unique: false, default: null},
  country:{type: 'string', unique: false},
  region: {type: 'string', unique: false},
});

const Users = new Schema({
  name: String,
  city: {type: String, unique: false},
  country: {type: String, unique: false},
  image: String,
  bucketList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

const Post = mongoose.model('Post', Posts);
const User = mongoose.model('User', Users);
const Tag = mongoose.model('Tag', Tags);
const Location = mongoose.model('Location', Locations);

