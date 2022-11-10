const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/upload");

const { getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/categories")

router.get('/categories', getList)

router.get('/categories/:id', getOne)

router.get('/categories', getMany)

router.delete('/categories/:id', deleteOne)

router.delete('/categories', deleteMany)

router.put('/categories/:id', upload.single("image"), updateOne)

router.put('/categories', updateMany)

router.post('/categories', upload.single("image"), createOne)

module.exports = router