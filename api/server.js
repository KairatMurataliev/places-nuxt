const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();

const port = 8000;
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const users = require('./app/users');

mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;


db.once('open', () => {
    console.log('Mongoose connected!');

    app.use('/users', users());
    // app.use('/images', images());
    // app.use('/places', places());
    // app.use('/reviews', reviews());

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
});
