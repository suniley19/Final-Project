const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req,file,cb) => {
        return cb(null,req.query.name)
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'application/pdf' || file.mimetype === 'video/mp4') {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Oly PDF and Mp4 files are allowed.'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024}
})

module.exports = upload;