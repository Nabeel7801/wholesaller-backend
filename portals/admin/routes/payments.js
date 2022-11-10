const express = require("express");
const router = express.Router();

const { getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/payments")

router.get('/payments', getList)

router.get('/payments/:id', getOne)

router.get('/payments', getMany)

router.delete('/payments/:id', deleteOne)

router.delete('/payments', deleteMany)

router.put('/payments/:id', updateOne)

router.put('/payments', updateMany)

router.post('/payments', createOne)

module.exports = router