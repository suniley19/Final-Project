const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const FileMeta = require('../models/FileMeta');


// multer setup
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, path.join(__dirname, '..', 'uploads'));
},
filename: function (req, file, cb) {
const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
cb(null, unique + path.extname(file.originalname));
}
});


function fileFilter (req, file, cb) {
const allowed = ['.pdf', '.mp4'];
const ext = path.extname(file.originalname).toLowerCase();
if (!allowed.includes(ext)) return cb(new Error('Unsupported file type'), false);
cb(null, true);
}


const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter });


// POST /api/upload (auth required)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
try {
// req.file is the uploaded file, req.body.privacy expected
const file = new FileMeta({
filename: req.file.filename,
originalName: req.file.originalname,
path: '/uploads/' + req.file.filename,
size: req.file.size,
privacy: req.body.privacy || 'private',
uploaded_by: req.user.id
});
await file.save();
res.json({ msg: 'File uploaded', file });
} catch (err) {
console.error(err);
res.status(500).json({ msg: 'Upload failed', error: err.message });
}
});


// GET /api/public-files
router.get('/public-files', async (req, res) => {
const files = await FileMeta.find({ privacy: 'public' }).populate('uploaded_by', 'username');
res.json(files);
});


// GET /api/my-files (auth required)
router.get('/my-files', auth, async (req, res) => {
const files = await FileMeta.find({ uploaded_by: req.user.id });
res.json(files);
});


module.exports = router;