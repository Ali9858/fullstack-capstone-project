
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });
const natural = require('natural');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

// POST /sentiment
app.post('/sentiment', async (req, res) => {
    const { sentence } = req.query;

    if (!sentence) {
        logger.error('Не предоставлено предложение');
        return res.status(400).json({
            error: 'Не предоставлено предложение'
        });
    }

    try {
        // Создаем анализатор настроений
        const Analyzer = natural.SentimentAnalyzer;
        const stemmer = natural.PorterStemmer;

        const analyzer = new Analyzer(
            'English',
            stemmer,
            'afinn'
        );

        // Анализируем предложение
        const analysisResult = analyzer.getSentiment(
            sentence.split(' ')
        );

        let sentiment = 'нейтральное';

        if (analysisResult < 0) {
            sentiment = 'негативное';
        } else if (analysisResult > 0.33) {
            sentiment = 'позитивное';
        }

        logger.info(
            `Результат анализа настроений: ${analysisResult}`
        );

        return res.status(200).json({
            sentimentScore: analysisResult,
            sentiment: sentiment
        });

    } catch (error) {
        logger.error(
            `Ошибка при выполнении анализа настроений: ${error.message}`
        );

        return res.status(500).json({
            message: 'Ошибка при выполнении анализа настроений'
        });
    }
});

// Запуск сервера
app.listen(port, () => {
    logger.info(`Сервер запущен на порту ${port}`);
});


