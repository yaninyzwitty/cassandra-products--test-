const express = require('express');
const { createProduct, getProducts, getProduct } = require('../controller/productsController')
const router = express.Router();


router.post('/', createProduct);
router.get('/', getProducts)
router.get('/:id', getProduct)

module.exports = router;