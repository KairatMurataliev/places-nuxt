const express = require('express');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const config = require('../config');
const Place = require('../models/Place');
const multer = require('multer');
const {nanoid} = require('nanoid');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});
const upload = multer({storage});

const addNewPlace = async (req, res) => {
    try {
        if (!req.file.filename) {
            req.file.filename = '';
        }

        const place = await new Place({
            title: req.body.title,
            description: req.body.description,
            userId: req.body.userId,
            image: req.file.filename
        });

        await place.save();
        return res.send({message: 'Place created!'})
    } catch (error) {
        console.log(error, "places.js:::ADD NEW PLACE METHOD");
        res.status(500).send({message: 'You can not add new place at this moment!'});
    }
}

const getPlaces = async (req, res) => {
    try {
        const places = await Place.find().populate("userId");
        return res.send(places)
    } catch (e) {
        console.log(e);
    }
}

const getPlaceById = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id).populate('userId');
        return res.send(place);
    } catch (e) {
        console.log(e);
    }
}

const deletePLace = async (req, res) => {
    try {
        await Place.findOneAndDelete({_id: req.params.id});
        return res.send({message: 'Place was deleted!'})
    } catch (e) {
        console.log(e);
    }
}

const createRouter = () => {
    const router = express.Router();

    router.post('/add-new-place',[auth, upload.single('image')], addNewPlace);

    router.get('/places', getPlaces);

    router.get('/places/:id', getPlaceById)

    router.delete('/delete-place/:id', [auth, isAdmin], deletePLace)

    return router;
};

module.exports = createRouter;
