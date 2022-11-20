const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Products = require("../models/Products")

router.post('/getProductByCategories', (req, res) => {
    const categories = (req.body || []);
    console.log(categories)
    Products.aggregate([
        {
            $match: { 
                $or: [
                    { main_category: { $in: categories } }
                ]
            }
        }
    ])
    .then(response => res.json(response))
    .catch(err => res.status(400).json({ error: err }))
})

router.post('/getProductByChildCategory/:id', (req, res) => {
    Products.find({child_category: req.params.id})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/getProductBySubCategory/:id', (req, res) => {
    Products.find({sub_category: req.params.id})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/getProductByMainCategory/:id', (req, res) => {
    Products.find({main_category: req.params.id})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/getProductByID/:id', (req, res) => {
    Products.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})

module.exports = router