const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
const router = require('./routes');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(morgan('tiny'));
// app.use(morgan('dev')); ?
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/posts', router.posts);
app.use('/users', router.users);
app.use('/locations', router.locations);
app.use('/tags', router.tags);

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));

// module.exports.App = app;
