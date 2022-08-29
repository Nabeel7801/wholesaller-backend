const express = require("express");
const router = express.Router();

const { authenticateUser, getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/warehousesController")

router.post('/warehouse/authenticateUser/:username/:password', authenticateUser)

router.get('/admin/warehouses', getList)

router.get('/admin/warehouses/:id', getOne)

router.get('/admin/warehouses', getMany)

router.get('/admin/warehouses', getManyReference)

router.delete('/admin/warehouses/:id', deleteOne)

router.delete('/admin/warehouses', deleteMany)

router.put('/admin/warehouses/:id', updateOne)

router.put('/admin/warehouses', updateMany)

router.post('/admin/warehouses', createOne)

module.exports = router