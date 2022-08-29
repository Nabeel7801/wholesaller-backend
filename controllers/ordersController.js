
const Orders = require("../models/ordersSchema")

// Get List
const getOrdersCount = (req, res) => {
    
    Orders.count({status: "ordered"})
    .then(totalOrdered => {
        Orders.count({status: "delivered"})
        .then(totalDelivered => {
            Orders.count({status: "cancelled"})
            .then(totalCancelled => {
                res.json({ordered: totalOrdered, delivered: totalDelivered, cancelled: totalCancelled});
            })
        })
    }).catch(err => res.status(400).json({ error: err }))


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
        if (filter["reference"]) filter["reference"] = new RegExp('^' + filter.reference + '.*', "i");
        if (filter["total_gte"]) {filter["total"] = {$gt: parseFloat(filter["total_gte"])}; delete filter["total_gte"];}
        if (filter["date_gte"]) {filter["date"] = {$gt: filter["date_gte"]}; delete filter["date_gte"];}
        if (filter["date_lte"]) {filter["date"] = {$lt: filter["date_lte"]}; delete filter["date_lte"];}
        if (filter["q"]) delete filter["q"];
    
        Orders.aggregate([
            {$match: filter},
            {$count: "count"}
        ])
        .then(([tempRes]) => {
            const count = tempRes ? tempRes.count : 0;
            
            Orders.aggregate([
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
    Orders.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
const getMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Orders.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many Reference
const getManyReference = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Orders.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Create One
const createOne = (req, res) => {
    const newPost = new Orders(req.body);

    newPost.save()
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update One
const updateOne = (req, res) => {
    Orders.updateOne({_id: req.params.id}, req.body)
        .then(response => {console.log(response); res.json(response)})
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
const updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Orders.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
const deleteOne = (req, res) => {
    Orders.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
const deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Orders.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}


module.exports = { getOrdersCount, getList, getOne, getMany, getManyReference, createOne, updateOne, updateMany, deleteOne, deleteMany };