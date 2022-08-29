const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, "upload" + Date.now() + "-" + file.originalname)
    }
})
 
module.exports = multer({storage})