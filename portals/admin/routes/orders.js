const express = require("express");
const router = express.Router();

const { getOrdersCount, getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/orders")

router.get('/getOrdersCount', getOrdersCount)

router.get('/orders', getList)

router.get('/orders/:id', getOne)

router.get('/orders', getMany)

router.delete('/orders/:id', deleteOne)

router.delete('/orders', deleteMany)

router.put('/orders/:id', updateOne)

router.put('/orders', updateMany)

router.post('/orders', createOne)

module.exports = router