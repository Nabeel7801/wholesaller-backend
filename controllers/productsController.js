
const Products = require("../models/productsSchema")

// Get List
const getList = (req, res) => {
    let { sort, range, filter } = req.query;
    sort = sort ? JSON.parse(sort) : {"_id": 1};

    range = range ? JSON.parse(range) : [0, 100];
    filter = JSON.parse(filter);

    const skip = parseInt(range[0]);
    const limit = parseInt(range[1]) - parseInt(range[0]) + 1;

    if (filter["id"] && Array.isArray(filter["id"])) {
        getManyReference(req, res);

    }else {
        if (filter["total_gte"]) {filter["total"] = {$gt: parseFloat(filter["total_gte"])}; delete filter["total_gte"];}
        if (filter["date_gte"]) {filter["date"] = {$gt: filter["date_gte"]}; delete filter["date_gte"];}
        if (filter["date_lte"]) {filter["date"] = {$lt: filter["date_lte"]}; delete filter["date_lte"];}
        if (filter["q"]) {
            filter["reference"] = new RegExp(filter["q"], "i");
            delete filter["q"];
        }
    
        Products.aggregate([
            {$match: filter},
            {$count: "count"}
        ])
        .then(([tempRes]) => {
            const count = tempRes ? tempRes.count : 0;
            
            Products.aggregate([
                {$skip: skip},
                {$match: filter},
                {$limit: limit},
                {$sort: sort}
            ]).then(response => {
                response.push({'content-range': `items ${skip}-${range[1]}/${count}`});
                res.json(response);
            })
            .catch(err => res.status(400).json({ error: err }))
    
        })

    }

}

// Get One
const getOne = (req, res) => {
    Products.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
const getMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Products.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many Reference
const getManyReference = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Products.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Create One
const createOne = (req, res) => {
    const obj = {
        ...req.body,
        image: req.file && req.file.filename
    };

    if (!obj["image"]) delete obj["image"];
 
    const newProduct = new Products(obj);

    newProduct.save()
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update One
const updateOne = (req, res) => {
    const obj = {
        ...req.body,
        image: req.file && req.file.filename
    };

    if (!obj["image"]) delete obj["image"];

    Products.findByIdAndUpdate(req.params.id, obj)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
const updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Products.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
const deleteOne = (req, res) => {
    Products.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
const deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Products.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}


module.exports = { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany };