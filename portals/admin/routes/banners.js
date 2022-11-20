const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/upload");

const { getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/banners")

router.get('/banners', getList)

router.get('/banners/:id', getOne)

router.get('/banners', getMany)

router.delete('/banners/:id', deleteOne)

router.delete('/banners', deleteMany)

router.put('/banners/:id', upload.single("image"), updateOne)

router.put('/banners', updateMany)

router.post('/banners', upload.single("image"), createOne)

module.exports = router