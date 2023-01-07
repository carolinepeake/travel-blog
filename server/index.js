const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const { sessionHandler , logger } = require('./middleware');
// const router = require('./routes');
const bodyParser = require('body-parser');
const postsRouter = require('./routes/posts');
const tagsRouter = require('./routes/tags');
const usersRouter = require('./routes/users');
const locationsRouter = require('./routes/locations');

//let router = express.Router({mergeParams: true});

// decodeURIComponent => will decode a URI into segments, e.g., params, query, ex cetra

// Establishes connection to the database on server start
// const db = require("./db");

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// app.use(morgan('tiny'));
app.use(morgan('dev'));
app.use(bodyParser.json());

// Adds `req.session_id` based on the incoming cookie value.
// Generates a new session if one does not exist.
app.use(sessionHandler);

// Logs the time, session_id, method, and url of incoming requests.
app.use(logger);

app.use(express.static(path.join(__dirname, '../client/dist')));

//app.use('/posts', router.posts);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/locations', locationsRouter);
app.use('/tags', tagsRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// module.exports.App = app;

// set express's env (environment variable) to production when time.  Also set NODE_ENV's environment variable.
