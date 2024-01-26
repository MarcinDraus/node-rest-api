const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/concerts', (req, res) => {
    res.json(db.concerts);
});

module.exports = router