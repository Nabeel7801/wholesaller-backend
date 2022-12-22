
const Orders = require("../../../models/Orders")

// Get List
exports.getOrdersCount = (req, res) => {
    
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
exports.getList = (req, res) => {
    let { sort, range, filter } = req.query;
    sort = sort ? JSON.parse(sort) : {"_id": 1};

    range = range ? JSON.parse(range) : [0, 100];
    filter = filter ? JSON.parse(filter) : {};

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
                {$unwind: "$basket"},
                {
                    $lookup: {
                        from: "products",
                        let: {
                            productId: { $toObjectId: "$basket.product_id" },
                            product: "$basket"
                        },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$productId" ] } } },
                            { $replaceRoot: { newRoot: { $mergeObjects: ["$$product", "$$ROOT"] } } }
                        ],
                        as: "basket"
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        basket: { $push: { $first: "$basket" } },
                        reference: { $first: "$reference" },
                        date: { $first: "$date" },
                        delivered_at: { $first: "$delivered_at" },
                        customer_id: { $first: "$customer_id" },
                        delivery_fees: { $first: "$delivery_fees" },
                        total: { $first: "$total" },
                        status: { $first: "$status" },
                        returned: { $first: "$returned" },
                        dealer_type: { $first: "$dealer_type" },
                        dealer_id: { $first: "$dealer_id" },
                    }
                },
                {$sort: sort},
                {$limit: limit},

            ]).then(response => {
                res.setHeader('Content-Range', `items ${skip}-${range[1]}/${count}`);
                res.json(response);

            }).catch(err => {
                console.log(err)
                res.status(400).json({ error: err.message })
            })
    
        })

    }

}

// Get One
exports.getOne = (req, res) => {
    Orders.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
exports.getMany = (req, res) => {
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
exports.createOne = (req, res) => {
    Orders.findOne({}, {}, { sort: { 'reference' : -1 } })
    .then(order => {
        const reference = (order && order.reference) 
        ? "WS-" + (("00000" + String(parseInt(order.reference.split('-')[1]) + 1)).slice(-5))
        : "WS-00001";

        const newPost = new Orders({...req.body, reference: reference});

        newPost.save()
            .then(response => res.json(response))
            .catch(err => res.status(400).json("Error: " + err))

    }).catch(err => res.status(400).json("Error: " + err))
    
}

// Update One
exports.updateOne = (req, res) => {
    Orders.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
exports.updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Orders.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
exports.deleteOne = (req, res) => {
    Orders.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
exports.deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Orders.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}
