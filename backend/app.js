const express = require('express');

const app = express();

app.get('/', async (req, res) => {
    res.send("Hello")
})

module.exports = app;