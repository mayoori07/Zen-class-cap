require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: "*", // Allow all origins (or specify your frontend URL)
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  }
app.use(cors(corsOptions));
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