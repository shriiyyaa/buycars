const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAll, addCar, updateCar, deleteCars } = require('../controllers/inventoryController');

router.get('/', getAll);
router.post('/', auth, addCar);
router.put('/:id', auth, updateCar);
router.delete('/', auth, deleteCars);

module.exports = router;