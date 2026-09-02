// const express = require('express');
// const Project = require('../models/Project');
// const router = express.Router();

// router.get('/', async (req, res) => {
//   const projects = await Project.find().populate('owner', 'name');
//   res.json(projects);
// });

// router.post('/', async (req, res) => {
//   const project = await Project.create(req.body);
//   res.status(201).json(project);
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Adjust path to your model
const Task = require('../models/Task');       // Adjust path to your model

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create project
router.post('/', async (req, res) => {
  try {
    const project = new Project({ title: req.body.title });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT edit project title
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project and all associated tasks
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project and associated tasks deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;