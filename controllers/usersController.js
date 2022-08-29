const Users = require("../models/usersSchema")

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
        
        Users.aggregate([
            {$match: filter},
            {$count: "count"}
        ])
        .then(([tempRes]) => {
            const count = tempRes ? tempRes.count : 0;
            
            Users.aggregate([
                {$skip: skip},
                {$match: filter},
                {$limit: limit},
                {$sort: sort},
                {
                    $lookup: {
                        from: "documents",
                        localField: "document",
                        foreignField: "_id",
                        as: "_document"
                    },
                },
                {
                    $set: {
                        status: { $arrayElemAt: ["$_document.status", 0] }
                    }
                }
                
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
    Users.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
const getMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Users.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many Reference
const getManyReference = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Users.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Create One
const createOne = (req, res) => {
    const newPost = new Users(req.body);

    newPost.save()
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update One
const updateOne = (req, res) => {
    Users.findByIdAndUpdate(req.params.id, req.body)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
const updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Users.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
const deleteOne = (req, res) => {
    Users.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
const deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Users.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}


module.exports = { getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany };