const express = require("express");
const router = express.Router();

const { authenticateUser, getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/warehouses")

router.post('/warehouse/authenticateUser/:username/:password', authenticateUser)

router.get('/warehouses', getList)

router.get('/warehouses/:id', getOne)

router.get('/warehouses', getMany)

router.delete('/warehouses/:id', deleteOne)

router.delete('/warehouses', deleteMany)

router.put('/warehouses/:id', updateOne)

router.put('/warehouses', updateMany)

router.post('/warehouses', createOne)

module.exports = router