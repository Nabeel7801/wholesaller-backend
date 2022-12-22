const md5 = require('md5')
const Warehouses = require("../../../models/Warehouses")

// Authenticate User
exports.authenticateUser = (req, res) => {
    const username= req.params.username
    const password = md5(req.params.password)

    Warehouses.find({username: username, password: password})
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err }))
}

// Get List
exports.getList = (req, res) => {
    let { sort, range, filter } = req.query;
    sort = sort ? JSON.parse(sort) : {"_id": 1};

    range = range ? JSON.parse(range) : [0, 100];
    filter = JSON.parse(filter);

    const skip = parseInt(range[0]);
    const limit = parseInt(range[1]) - parseInt(range[0]) + 1;

    if (filter["id"] && Array.isArray(filter["id"])) {
        getManyReference(req, res);

    }else {
        
        Warehouses.aggregate([
            {$match: filter},
            {$count: "count"}
        ])
        .then(([tempRes]) => {
            const count = tempRes ? tempRes.count : 0;
            
            Warehouses.aggregate([
                {$skip: skip},
                {$match: filter},
                {$sort: sort},
                {$limit: limit},
                {
                    $set: {
                        zipcodes: {$slice: ["$zipcodes", 5]}
                    }
                }
            ]).then(response => {
                res.setHeader('Content-Range', `items ${skip}-${range[1]}/${count}`);
                res.json(response);
            })
            .catch(err => res.status(400).json({ error: err }))
    
        })

    }

}

// Get One
exports.getOne = (req, res) => {
    Warehouses.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
exports.getMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Warehouses.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many Reference
const getManyReference = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Warehouses.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Create One
exports.createOne = (req, res) => {
    const newPost = new Warehouses(req.body);

    newPost.save()
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update One
exports.updateOne = (req, res) => {
    Warehouses.findByIdAndUpdate(req.params.id, req.body)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
exports.updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Warehouses.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
exports.deleteOne = (req, res) => {
    Warehouses.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
exports.deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Warehouses.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}
