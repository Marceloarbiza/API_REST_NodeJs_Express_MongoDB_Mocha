const mongoose = require('mongoose');
const logger = require('./utils/logger');
/*mongoose.Promise = Promise;*/
const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const config = require('config');
mongoose.connect(
    config.get('mongodb.db_connection'),
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => logger.info('Connected to MongoDB')
);

const bodyParser = require('body-parser');

/*mongoose.connect('mongodb://' + config.get('mongodb.address') + '/' + config.get('mongodb.dbname'), { useNewUrlParser: true, useUnifiedTopology: true });*/
// MARCELO
app.use(bodyParser.json());

/*____*/
/*require('./utils/initializer').init()*/

app.use('/api', require('./routes/stores'));


// Start the server
app.listen(config.get('port'));
logger.info('API initialized on port ' + config.get('port'));

module.exports = app

// ROUTES
app.get('/', (req, res) => {
    res.send('Hello World!');
});

/* IMPORT ROUTES
const stores = require('./routes/stores');
app.use('/api/stores', stores);*/
