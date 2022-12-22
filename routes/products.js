const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Products = require("../models/Products")

router.post('/getProductByCategories', (req, res) => {
    const categories = (req.body || []);
    Products.aggregate([
        {
            $match: { 
                $or: [
                    { main_category: { $in: categories } },
                    { sub_category: { $in: categories } },
                    { child_category: { $in: categories } }
                ]
            }
        }
    ])
    .then(response => {
        const products = response?.map(p => {const obj = { ...p, id: p._id }; delete obj["_id"]; return obj});
        res.json(products)
    })
    .catch(err => res.status(400).json({ error: err }))
})

module.exports = router