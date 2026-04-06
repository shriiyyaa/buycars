const express = require('express');
const router = express.Router();
const { getCount, search } = require('../controllers/oemController');

router.get('/count', getCount);
router.get('/search', search);

module.exports = router;