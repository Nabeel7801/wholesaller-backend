const express = require("express");
const router = express.Router();
const Categories = require("../models/Categories")

router.post('/categoriesByParent/:parent', (req, res) => {
    Categories.find({parent: req.params.parent})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})

router.post('/maincategories', (req, res) => {
    Categories.find({parent: "none"})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
})


module.exports = router