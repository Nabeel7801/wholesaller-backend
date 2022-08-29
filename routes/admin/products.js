const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");

const { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/productsController")

router.get('/admin/products', getList)

router.get('/admin/products/:id', getOne)

router.get('/admin/products', getMany)

router.get('/admin/products', getManyReference)

router.delete('/admin/products/:id', deleteOne)

router.delete('/admin/products', deleteMany)

router.put('/admin/products/:id', upload.single("image"), updateOne)

router.put('/admin/products', updateMany)

router.post('/admin/products', upload.single("image"), createOne)

module.exports = router