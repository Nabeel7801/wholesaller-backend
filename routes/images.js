const express = require('express');
const router = express.Router();

const path = require('path')
const fs = require('fs');

router.get('/:filename', (req, res) => {
    const filePath = path.join(__dirname, `../uploads/${req.params.filename}`);
    res.sendFile(filePath);
});

router.delete('/:filename', (req, res) => {
    const filePath = path.join(__dirname, `../uploads/${req.params.filename}`);
    try {
        fs.unlinkSync(filePath);
        res.send("File Deleted");
    } catch (error) {
        res.send("File Already Deleted");
    }
})

module.exports = router;