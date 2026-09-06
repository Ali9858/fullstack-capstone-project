const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../../sentiment/logger');

// Get all gifts
router.get('/', async (req, res, next) => {
    logger.info('/ called');

    try {
        const db = await connectToDatabase();

        const collection = db.collection("gifts");
        const gifts = await collection.find({}).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

// Get a single gift by ID
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        const id = req.params.id;
        const gift = await collection.findOne({ id: id });

        if (!gift) {
            return res.status(404).send("Gift not found");
        }

        res.json(gift);
    } catch (e) {
        next(e);
    }
});

module.exports = router;