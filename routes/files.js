// backend/routes/files.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const FileMeta = require('../models/FileMeta');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
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

// Upload endpoint with explicit multer error handling
router.post('/upload', auth, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    try {
      if (err) {
        // multer error (file too large, wrong type etc.)
        console.error("Multer error:", err);
        return res.status(400).json({ error: err.message });
      }

      // sanity checks
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const privacy = req.body.privacy === 'public' ? 'public' : 'private';

      let token = null;
      if (privacy === 'private') {
        token = crypto.randomBytes(16).toString('hex');
      }

      const fileDoc = new FileMeta({
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: '/uploads/' + req.file.filename,
        size: req.file.size,
        privacy,
        uploaded_by: req.user.id,
        privateToken: token
      });

      await fileDoc.save();

      // Return consistent response keys (message + file)
      return res.json({ message: 'File uploaded', file: fileDoc });
    } catch (e) {
      console.error("Upload route error:", e);
      return res.status(500).json({ error: e.message });
    }
  });
});

module.exports = router;
