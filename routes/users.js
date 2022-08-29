const mongoose = require('mongoose');
const express = require("express");
const md5 = require('md5')

const router = express.Router();
const upload = require("../middleware/upload");

const Users = require("../models/usersSchema")
const Documents = require("../models/documentsSchema")

router.post('/signin', (req, res) => {

    Users.find({email: req.body.email, password: md5(req.body.password)})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/register', (req, res) => {
    const newUser = new Users({...req.body, password: md5(req.body.password), document: null});

    Users.findOne({ email: req.body.email })
    .then(user => {
        if (user) res.json(null);
        else {
            newUser.save()
                .then(response => res.json(response))
                .catch(err => res.status(400).json("Error: " + err))
        }
        
    })
    .catch(err => res.status(400).json({ error: err }))
})

router.post('/uploadDocument/:id', upload.single("document"), (req, res) => {
    const newDocument = new Documents({...req.body, document: req.file?.filename});
    
    newDocument.save()
    .then(document => {
        Users.findByIdAndUpdate(req.params.id, {document: document._id})
            .then(response => res.json(document))
            .catch(err => res.status(400).json("Error: " + err))
        
    })
    .catch(err => res.status(400).json({ error: err }))
})

router.post('/getStatus/:id', (req, res) => {

    Documents.findById(mongoose.Types.ObjectId(req.params.id))
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})


module.exports = router