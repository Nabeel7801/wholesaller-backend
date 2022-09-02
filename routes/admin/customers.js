const express = require("express");
const router = express.Router();

const { getCount, getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/customersController")

router.get('/admin/customers_count', getCount)

router.get('/admin/customers', getList)

router.get('/admin/customers/:id', getOne)

router.get('/admin/customers', getMany)

router.get('/admin/customers', getManyReference)

router.delete('/admin/customers/:id', deleteOne)

router.delete('/admin/customers', deleteMany)

router.put('/admin/customers/:id', updateOne)

router.put('/admin/customers', updateMany)

router.post('/admin/customers', createOne)

module.exports = router