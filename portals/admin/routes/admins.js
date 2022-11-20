const express = require("express");
const router = express.Router();

const { authenticateUser, getList, getOne, getMany, createOne, updateOne, updateMany, deleteOne, deleteMany } = require("../controllers/admins")

router.post('/authenticateUser/:username/:password', authenticateUser)

router.get('/admins', getList)

router.get('/admins/:id', getOne)

router.get('/admins', getMany)

router.delete('/admins/:id', deleteOne)

router.delete('/admins', deleteMany)

router.put('/admins/:id', updateOne)

router.put('/admins', updateMany)

router.post('/admins', createOne)

module.exports = router