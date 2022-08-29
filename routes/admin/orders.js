const express = require("express");
const router = express.Router();

const { getOrdersCount, getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/ordersController")

router.get('/admin/getOrdersCount', getOrdersCount)

router.get('/admin/orders', getList)

router.get('/admin/orders/:id', getOne)

router.get('/admin/orders', getMany)

router.get('/admin/orders', getManyReference)

router.delete('/admin/orders/:id', deleteOne)

router.delete('/admin/orders', deleteMany)

router.put('/admin/orders/:id', updateOne)

router.put('/admin/orders', updateMany)

router.post('/admin/orders', createOne)

module.exports = router