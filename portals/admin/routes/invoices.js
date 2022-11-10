const express = require("express");
const router = express.Router();

const { getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/invoices")

router.get('/invoices', getList)

router.get('/invoices/:id', getOne)

router.get('/invoices', getMany)

router.delete('/invoices/:id', deleteOne)

router.delete('/invoices', deleteMany)

router.put('/invoices/:id', updateOne)

router.put('/invoices', updateMany)

router.post('/invoices', createOne)

module.exports = router