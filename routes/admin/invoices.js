const express = require("express");
const router = express.Router();

const { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/invoicesController")

router.get('/admin/invoices', getList)

router.get('/admin/invoices/:id', getOne)

router.get('/admin/invoices', getMany)

router.get('/admin/invoices', getManyReference)

router.delete('/admin/invoices/:id', deleteOne)

router.delete('/admin/invoices', deleteMany)

router.put('/admin/invoices/:id', updateOne)

router.put('/admin/invoices', updateMany)

router.post('/admin/invoices', createOne)

module.exports = router