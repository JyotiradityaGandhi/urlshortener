const express = require('express');
const dotenv = require('dotenv');

const globalErrorHandler = require('./controllers/errorController');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();


app.all('*', (req, res, next) => {
    next(new AppError(`Invalid URL: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;