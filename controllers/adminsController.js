const md5 = require('md5')
const Admins = require("../models/adminsSchema")

// Authenticate User
const authenticateUser = (req, res) => {
    const username= req.params.username
    const password = md5(req.params.password)

    Admins.find({username: username, password: password})
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ error: err }))
}


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
        if (filter["first_name"]) filter["first_name"] = new RegExp('^' + filter.first_name + '.*', "i");
        if (filter["q"]) delete filter["q"];
    
        Admins.aggregate([
            {$skip: skip},
            {$match: filter},
            {$limit: limit},
            {$sort: sort},

        ]).then(response => res.json(response))
            .catch(err => res.status(400).json({ error: err }))

    }

}

// Get One
const getOne = (req, res) => {
    Admins.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
const getMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Admins.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many Reference
const getManyReference = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Admins.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Create One
const createOne = (req, res) => {
    const newAdmin = new Admins(req.body);

    newAdmin.save()
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update One
const updateOne = (req, res) => {
    Admins.findByIdAndUpdate(req.params.id, req.body)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
const updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Admins.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
const deleteOne = (req, res) => {
    Admins.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
const deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Admins.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}


module.exports = { authenticateUser, getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany };