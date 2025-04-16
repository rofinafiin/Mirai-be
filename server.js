const express = require('express');
require('dotenv').config();
const app = express();
const { logger, errorHandler } = require('./middleware/middleware');
require('./config/db');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logger);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});