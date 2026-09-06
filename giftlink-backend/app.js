require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pinoLogger = require('../sentiment/logger');

const connectToDatabase = require('./models/db');

const app = express();

const port = 3060;

app.use(cors());
app.use(express.json());

// Подключение к MongoDB
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
    })
    .catch((e) => {
        pinoLogger.error(e, 'Failed to connect to DB');
    });

// Routes
const giftRoutes = require('./routes/giftRoutes');
const searchRoutes = require('./routes/searchRoutes');
const authRoutes = require('./routes/authRoutes');

const pinoHttp = require('pino-http');

app.use(pinoHttp({ logger: pinoLogger }));

// API routes
app.use('/api/gifts', giftRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Проверка сервера
app.get('/', (req, res) => {
    res.send('Inside the server');
});

app.listen(port, () => {
    pinoLogger.info(`Server running on port ${port}`);
});

