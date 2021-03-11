const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    placeId: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    review: {
        type: String,
        required: true
    }
});


const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
