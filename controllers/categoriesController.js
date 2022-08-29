
const Categories = require("../models/categoriesSchema")

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
        if (filter["title"]) filter["title"] = new RegExp('^' + filter.title + '.*', "i");
        if (filter["q"]) delete filter["q"];
    
        Categories.aggregate([
            {$match: filter},
            {$count: "count"}
        ])
        .then(([tempRes]) => {
            const count = tempRes ? tempRes.count : 0;
            
            Categories.aggregate([
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
    Categories.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
const getMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Categories.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many Reference
const getManyReference = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Categories.find({_id: {$in: ids}})
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

    const newPost = new Categories(obj);

    newPost.save()
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

    Categories.findByIdAndUpdate(req.params.id, obj)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
const updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Categories.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
const deleteOne = (req, res) => {
    Categories.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
const deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Categories.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}


module.exports = { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany };