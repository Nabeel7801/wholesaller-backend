const express = require("express");
const router = express.Router();

const { getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/customers")

router.get('/customers', getList)

router.get('/customers/:id', getOne)

router.get('/customers', getMany)

router.delete('/customers/:id', deleteOne)

router.delete('/customers', deleteMany)

router.put('/customers/:id', updateOne)

router.put('/customers', updateMany)

router.post('/customers', createOne)

module.exports = router