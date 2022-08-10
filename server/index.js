const express = require('express');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '../client/dist')));


app.listen(process.env.PORT, () => console.log(`Listening at http://localhost:${process.env.PORT}`));
