const express = require("express");

const app = express();

app.use("/admin", require("./routes/admins"))

app.use("/admin", require("./routes/products"))
app.use("/admin", require("./routes/categories"))

app.use("/admin", require("./routes/orders"))
app.use("/admin", require("./routes/invoices"))

app.use("/admin", require("./routes/payments"))

app.use("/admin", require("./routes/users"))
app.use("/admin", require("./routes/customers"))
app.use("/admin", require("./routes/warehouses"))

app.use("/admin", require("./routes/banners"))

module.exports = app