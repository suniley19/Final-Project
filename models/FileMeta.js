const mongoose = require('mongoose');


const FileSchema = new mongoose.Schema({
filename: { type: String, required: true },
originalName: { type: String },
path: { type: String, required: true },
size: { type: Number },
privacy: { type: String, enum: ['public', 'private'], default: 'private' },
uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
uploaded_at: { type: Date, default: Date.now },
privateToken: { type: String, required: true }
});



module.exports = mongoose.model('FileMeta', FileSchema);