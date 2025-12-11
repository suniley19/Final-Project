const asyncHandler = require('express-async-handler')
const fs = require('fs')
const path = require('path')
const filelist = require('../models/fileModel')

//@desc Post a file
//@route POST /api/upload
//@access public
const uploadFile = asyncHandler(async (req,res) => {

    console.log("hello")
    if(!req.file) {
        res.status(400)
        throw new Error('No file uploaded')
    }

    console.log(req.file.originalname)

    const privacySetting = req.body.privacy === 'public' ? 'public' : 'private'

    const newfile = await filelist.create({
        filename: req.file.filename,
        path: req.file.path, 
        size: req.file.size,  
        privacy: privacySetting,
        uploaded_by: req.user.id
    })
    res.status(201).json({newfile})
})

//@desc Get all public files
//@route GET /api/public-file
//@access public
const getPublicFile = asyncHandler(async (req,res) => {
    const folderPath = path.join(__dirname, "..", "uploads");

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        console.log("Files in directory:", files);
        res.status(200).json({files})

        files.forEach(file => {
            const fullPath = path.join(folderPath, file);
            console.log("Full path:", fullPath);
        });
    });

})

//@desc Get my files
//@route GET /api/my-files
//@access public
const getMyFile = asyncHandler(async (req,res) => {
    try {
        const files = await filelist.find({
            privacy: "public" 
        })
        .select('filename size uploadedAt userId')
        .populate({
            path: 'userId',
            select: 'username -_id'
        })
        .sort({ uploadedAt: -1 }) 
        .lean();

        const formattedFiles = files.map(file => ({
            
            id: file._id,
            filename: file.filename,
            size: file.size,
            uploadedBy: file.userId ? file.userId.username : 'Unknown', 
            uploadedAt: file.uploadedAt,
        }));

        res.json({ files: formattedFiles });
    } catch (error) {
        console.error("Fetch public files error:", error);
        res.status(500).json({ error: "Failed to fetch public files" });
    }
})

//@desc Download a file
//@route GET /api/files/:id/download
//@access public
const downloadFile = asyncHandler(async (req,res) => {
    // filename = 'nitish.pdf'
    // const file = await filelist.findOne({filename})
    // res.json({file})

    const { fileName } = req.params;
    const filePath = path.join(__dirname,'..','uploads', 'nitish.pdf');

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('File not found.');
      }

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (streamErr) => {
        console.error('Error streaming file:', streamErr);
        res.status(500).send('Error downloading file.');
      });
    });
})

//@desc Delete a file
//@route Delete /api/files/:id
//@access public
const deleteFile = asyncHandler(async (req,res) => {
    res.json({message: 'Delete file (owner only)'})
})

module.exports = {
    uploadFile,
    getPublicFile,
    getMyFile,
    downloadFile,
    deleteFile
}