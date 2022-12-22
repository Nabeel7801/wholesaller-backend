
const Invoices = require("../../../models/Invoices")

const getCurrentDate = () => {
    const date = new Date();
    const dd = ("00" + date.getDate()).slice(-2);
    const mm = ("00" + String(parseInt(date.getMonth())+1)).slice(-2);
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`
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
        if (filter["reference"]) filter["reference"] = new RegExp('^' + filter.reference + '.*', "i");
        if (filter["total_gte"]) {filter["total"] = {$gt: parseFloat(filter["total_gte"])}; delete filter["total_gte"];}
        if (filter["date_gte"]) {filter["date"] = {$gt: filter["date_gte"]}; delete filter["date_gte"];}
        if (filter["date_lte"]) {filter["date"] = {$lt: filter["date_lte"]}; delete filter["date_lte"];}
        if (filter["q"]) delete filter["q"];
    
        Invoices.aggregate([
            {$match: filter},
            {$count: "count"}
        ])
        .then(([tempRes]) => {
            const count = tempRes ? tempRes.count : 0;
            
            Invoices.aggregate([
                {$skip: skip},
                {$match: filter},
                {$sort: sort},
                {$limit: limit},
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
    Invoices.findById(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many
exports.getMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Invoices.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Get Many Reference
const getManyReference = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Invoices.find({_id: {$in: ids}})
        .then(response => res.json(response))
        .catch(err => res.status(400).json({ error: err }))
}

// Create One
exports.createOne = (req, res) => {

    Invoices.findOne({}, {}, { sort: { 'reference' : -1 } })
    .then(invoice => {
        const reference = (invoice && invoice.reference) 
        ? "INV-" + (("00000" + String(parseInt(invoice.reference.split('-')[1]) + 1)).slice(-5))
        : "INV-00001";

        const { order } = req.body;
        const currentDate = getCurrentDate();

        const newInvoice = new Invoices({
            reference: reference,
            order_id: order.id,
            date: currentDate,
            due_date: currentDate,
            customer_id: order.customer_id,
            status: "unpaid",
            amount: order.total,
            delivery_fees: order.delivery_fees,
            balance_due: order.total
        });

        newInvoice.save()
            .then(response => res.json(response))
            .catch(err => res.status(400).json("Error: " + err))

    })
    .catch(err => res.status(400).json("Error: " + err))
}

// Update One
exports.updateOne = (req, res) => {
    Invoices.updateOne({_id: req.params.id}, req.body)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Update Many
exports.updateMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Invoices.updateMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
        
}

// Delete One
exports.deleteOne = (req, res) => {
    Invoices.findByIdAndDelete(req.params.id)
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}

// Delete Many
exports.deleteMany = (req, res) => {
    const { filter } = req.query;
    const ids = JSON.parse(filter)["id"];

    Invoices.deleteMany({_id: { $in: ids }})
        .then(response => res.json(response))
        .catch(err => res.status(400).json("Error: " + err))
}
