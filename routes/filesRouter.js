const express = require('express')
const router = express.Router()
const {
    uploadFile,
    getPublicFile,
    getMyFile,
    downloadFile,
    deleteFile
} = require('../controller/filesController.js')
const validateToken = require('../middleware/validateTokenHandler.js')
const upload = require('../middleware/uploadFile.js')

router.post('/upload',validateToken,upload.single('media'),uploadFile)

router.get('/public-file', getPublicFile)

router.get('/my-files', getMyFile)

router.get('/files/:id/download', downloadFile)

router.delete('/files/:id', deleteFile)

module.exports = router;

