require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const connectDB = require('./database/mongo');
const routes = require('./routes/route');

const PORT = process.env.PORT || 3000;

// Built-in body-parser middleware
app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded
connectDB();
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});