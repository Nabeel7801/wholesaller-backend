const express = require("express");
const router = express.Router();

const { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/paymentsController")

router.get('/admin/payments', getList)

router.get('/admin/payments/:id', getOne)

router.get('/admin/payments', getMany)

router.get('/admin/payments', getManyReference)

router.delete('/admin/payments/:id', deleteOne)

router.delete('/admin/payments', deleteMany)

router.put('/admin/payments/:id', updateOne)

router.put('/admin/payments', updateMany)

router.post('/admin/payments', createOne)

module.exports = router