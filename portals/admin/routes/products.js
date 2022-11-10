const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/upload");

const { getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/products")

router.get('/products', getList)

router.get('/products/:id', getOne)

router.get('/products', getMany)

router.delete('/products/:id', deleteOne)

router.delete('/products', deleteMany)

router.put('/products/:id', upload.single("image"), updateOne)

router.put('/products', updateMany)

router.post('/products', upload.single("image"), createOne)

module.exports = router