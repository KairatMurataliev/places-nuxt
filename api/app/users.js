const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
        await user.save();
        return res.send(user)
    } catch (e) {
        console.log(e);
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) {
            return res.status(400).send({message: 'Username not found'});
        }

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) {
            return res.status(400).send({error: 'Password is wrong!'});
        }

        user.token = user.generateToken();

        await user.save();

        return res.send({message: 'User and password correct!', user});
    } catch (e) {
        console.log(e);
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.get('Token');
        const success = {message: 'Logout success!'};

        if (!token) return res.send(success);

        const user = await User.findOne({token});

        if (!user) return res.send(success);

        user.generateToken();
        await user.save();

        return res.send(success);
    } catch (e) {
        console.log(e);
    }
}


const createRouter = () => {
    const router = express.Router();

    router.post('/', registerUser);

    router.post('/sessions', loginUser);

    router.delete('/sessions', logoutUser)

    return router;
};

module.exports = createRouter;
