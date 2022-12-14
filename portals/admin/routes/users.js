const express = require("express");
const router = express.Router();
const upload = require("../../../middleware/upload");

const { getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/users")

router.get('/users', getList)

router.get('/users/:id', getOne)

router.get('/users', getMany)

router.delete('/users/:id', deleteOne)

router.delete('/users', deleteMany)

router.put('/users/:id', upload.single("image"), updateOne)

router.put('/users', updateMany)

router.post('/users', createOne)

module.exports = router