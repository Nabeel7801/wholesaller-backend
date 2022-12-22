const mongoose = require('mongoose');
const Users = require("../../../models/Users")
const CryptoJS = require("crypto-js");

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
        
        Users.aggregate([
            {$match: filter},
            {$count: "count"}
        ])
        .then(([tempRes]) => {
            const count = tempRes ? tempRes.count : 0;
            
            Users.aggregate([
                {$skip: skip},
                {$match: filter},
                {$sort: sort},
                {$limit: limit},
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
                        filename: { $arrayElemAt: ["$_document.document", 0] },
                        status: { $arrayElemAt: ["$_document.status", 0] }
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
    Users.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
        },
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
                filename: { $arrayElemAt: ["$_document.document", 0] },
                type: { $arrayElemAt: ["$_document.type", 0] },
                status: { $arrayElemAt: ["$_document.status", 0] }
            }
        }
        
    ])
        .then(response => res.json({
            ...response[0], 
            password: CryptoJS.AES.decrypt(response[0].password, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
        }))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
exports.getMany = (req, res) => {
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
exports.createOne = (req, res) => {
    const newPost = new Users(req.body);

    newPost.save()
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update One
exports.updateOne = (req, res) => {
    const obj = {
        ...req.body,
        avatar: req.file && req.file.filename
    };

    if (!obj["avatar"]) delete obj["avatar"];

    Users.findByIdAndUpdate(req.params.id, obj, {new: true})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
exports.updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Users.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
exports.deleteOne = (req, res) => {
    Users.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
exports.deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Users.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}
