const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const logger = pino();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


// =========================
// REGISTER
// =========================
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const db = await connectToDatabase();
        const collection = db.collection('users');

        const existingEmail = await collection.findOne({ email });

        if (existingEmail) {
            logger.error('Email already exists');

            return res.status(400).json({
                error: 'Email already exists'
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(password, salt);

        const newUser = await collection.insertOne({
            email,
            firstName,
            lastName,
            password: hash,
            createdAt: new Date()
        });

        const payload = {
            user: {
                id: newUser.insertedId.toString()
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');

        return res.status(200).json({
            authtoken,
            email
        });

    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});


// =========================
// LOGIN
// =========================
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');

        const theUser = await collection.findOne({
            email: req.body.email
        });

        if (!theUser) {
            logger.error('User not found');

            return res.status(404).json({
                error: 'User not found'
            });
        }

        const result = await bcryptjs.compare(
            req.body.password,
            theUser.password
        );

        if (!result) {
            logger.error('Passwords do not match');

            return res.status(404).json({
                error: 'Wrong password'
            });
        }

        const payload = {
            user: {
                id: theUser._id.toString()
            }
        };

        const userName = theUser.firstName;
        const userEmail = theUser.email;

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User logged in successfully');

        return res.status(200).json({
            authtoken,
            userName,
            userEmail
        });

    } catch (e) {
        logger.error(e);

        return res.status(500).json({
            error: 'Internal server error',
            details: e.message
        });
    }
});


// =========================
// UPDATE PROFILE
// =========================
router.put(
    '/update',
    [
        body('name')
            .notEmpty()
            .withMessage('Name is required')
    ],
    async (req, res) => {

        // Validate request body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            logger.error('Validation errors in update request');

            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            // Get email from request header
            const email = req.headers.email;

            if (!email) {
                logger.error('Email not found in request headers');

                return res.status(400).json({
                    error: 'Email not found in request headers'
                });
            }

            // Connect to MongoDB
            const db = await connectToDatabase();
            const collection = db.collection('users');

            // Find existing user
            const existingUser = await collection.findOne({
                email
            });

            if (!existingUser) {
                logger.error('User not found');

                return res.status(404).json({
                    error: 'User not found'
                });
            }

            // Update user data
            existingUser.firstName = req.body.name;
            existingUser.updatedAt = new Date();

            await collection.updateOne(
                { email },
                {
                    $set: {
                        firstName: existingUser.firstName,
                        updatedAt: existingUser.updatedAt
                    }
                }
            );

            // Get updated user
            const updatedUser = await collection.findOne({
                email
            });

            // Create JWT
            const payload = {
                user: {
                    id: updatedUser._id.toString()
                }
            };

            const authtoken = jwt.sign(
                payload,
                JWT_SECRET
            );

            logger.info('User updated successfully');

            return res.status(200).json({
                authtoken
            });

        } catch (e) {
            logger.error(e);

            return res.status(500).send(
                'Internal server error'
            );
        }
    }
);


module.exports = router;


