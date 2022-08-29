const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");

const { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/categoriesController")

router.get('/admin/categories', getList)

router.get('/admin/categories/:id', getOne)

router.get('/admin/categories', getMany)

router.get('/admin/categories', getManyReference)

router.delete('/admin/categories/:id', deleteOne)

router.delete('/admin/categories', deleteMany)

router.put('/admin/categories/:id', upload.single("image"), updateOne)

router.put('/admin/categories', updateMany)

router.post('/admin/categories', upload.single("image"), createOne)

module.exports = router