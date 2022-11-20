const mongoose = require('mongoose');
const express = require("express");
const CryptoJS = require("crypto-js");
const md5 = require('md5')

const router = express.Router();
const upload = require("../middleware/upload");

const Users = require("../models/Users")
const Documents = require("../models/Documents")
const Customers = require("../models/Customers")

router.post('/signin', (req, res) => {

    Users.findOne({email: req.body.email})
        .then(response => {
            const password = CryptoJS.AES.decrypt(response.password, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
            if (password === req.body.password) {
                res.json(response);
            }else {
                res.json(null);
            }
        })
        .catch(err => res.status(400).json({ error: err }))
    
})

router.post('/register', (req, res) => {
    console.log(req.body.password)
    const password = CryptoJS.AES.encrypt(req.body.password, process.env.ENCRYPTION_KEY).toString();
    const newUser = new Users({...req.body, password, document: null});

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

router.put('/updateStatus/:id', (req, res) => {
    Documents.findByIdAndUpdate(req.params.id, req.body)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))

})

router.post('/getStatus/:id', (req, res) => {

    Documents.findById(mongoose.Types.ObjectId(req.params.id))
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})

router.get('/getCustomerID/:userID', (req, res) => {
    Customers.find({ user_id: mongoose.Types.ObjectId(req.params.userID) })
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})


module.exports = router