const express = require("express");
const router = express.Router();

const { authenticateUser, getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../../controllers/adminsController")

router.post('/admin/authenticateUser/:username/:password', authenticateUser)

router.get('/admin/admins', getList)

router.get('/admin/admins/:id', getOne)

router.get('/admin/admins', getMany)

router.get('/admin/admins', getManyReference)

router.delete('/admin/admins/:id', deleteOne)

router.delete('/admin/admins', deleteMany)

router.put('/admin/admins/:id', updateOne)

router.put('/admin/admins', updateMany)

router.post('/admin/admins', createOne)

module.exports = router