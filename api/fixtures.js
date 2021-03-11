const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Place = require('./models/Place');
const Review = require('./models/Review');

mongoose.connect(config.db.url + '/' + config.db.name);

const db = mongoose.connection;

db.once('open', async () => {
    try {
        await db.dropCollection('places');
        await db.dropCollection('users');
        await db.dropCollection('images');
        await db.dropCollection('reviews');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    console.log('collection is dropped');

    const [kairat, admin, user2] = await User.create({
        username: 'kairat',
        password: '123',
    }, {
        username: 'admin',
        password: 'admin',
        role: 'admin'
    }, {
        username: 'user2',
        password: '123'
    });

    console.log('user created');

    await db.close();
});
