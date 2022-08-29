const express = require("express");
const router = express.Router();

const { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/usersController")

router.get('/admin/users', getList)

router.get('/admin/users/:id', getOne)

router.get('/admin/users', getMany)

router.get('/admin/users', getManyReference)

router.delete('/admin/users/:id', deleteOne)

router.delete('/admin/users', deleteMany)

router.put('/admin/users/:id', updateOne)

router.put('/admin/users', updateMany)

router.post('/admin/users', createOne)

module.exports = router