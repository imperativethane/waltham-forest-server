const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler')
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');

const app = express();
const PORT = process.env.PORT || 4000;

const databaseUrl = process.env.DATABASE_URL;
const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: process.env.DATABASE_USERNAME,
    pass: process.env.DATABASE_PASSWORD,
    dbName: "waltham-forest"
};

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

mongoose.connect(databaseUrl, options, () => console.log('connected to DB!'));

const playerRouter = require('./routes/players');
app.use('/players', playerRouter);

app.use(errorhandler());

app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}`);
})

module.exports = app;