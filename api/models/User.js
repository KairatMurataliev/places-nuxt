const mongoose = require('mongoose');
const config = require('../config');
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');
const {nanoid} = require('nanoid');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        validate: {
            validator: async function (value) {
                if (!this.isModified('username')) return true;

                const user = await User.findOne({username: value});
                if (user) throw new Error('This user already exists');
                return true;
            },
            message: 'This username already exists'
        }
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        default: 'user',
        num: ['user', 'admin']
    }
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSaltSync(SALT_WORK_FACTOR);
    this.password = await bcrypt.hashSync(this.password, salt);

    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateToken = function () {
    return nanoid(20);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
