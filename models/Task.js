const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: String, default: 'Unassigned' },
  comments: [{
    userName: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

