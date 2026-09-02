// const express = require('express');
// const Task = require('../models/Task');

// module.exports = (io) => {
//   const router = express.Router();

//   // Get tasks by project
//   router.get('/project/:projectId', async (req, res) => {
//     try {
//       const tasks = await Task.find({ project: req.params.projectId });
//       res.json(tasks);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

//   // Create task
//   router.post('/', async (req, res) => {
//     try {
//       const { title, description, project, assignedTo } = req.body;

//       if (!title || !project) {
//         return res.status(400).json({ error: 'Title and Project are required' });
//       }

//       const newTask = new Task({
//         title,
//         description: description || '',
//         project,
//         assignedTo: assignedTo || 'Unassigned',
//         status: 'Todo'
//       });

//       await newTask.save();

//       if (io) {
//         io.to(project).emit('task-updated', {
//           message: `New task created: "${title}" (Assigned to: ${assignedTo || 'Unassigned'})`
//         });
//       }

//       res.status(201).json(newTask);
//     } catch (err) {
//       console.error('Error saving task:', err);
//       res.status(500).json({ error: err.message });
//     }
//   });

//   // PATCH /api/tasks/:id/status
//   router.patch('/:id/status', async (req, res) => {
//     try {
//       const { status } = req.body;
      
//       const updatedTask = await Task.findByIdAndUpdate(
//         req.params.id,
//         { status },
//         { new: true }
//       );

//       if (!updatedTask) {
//         return res.status(404).json({ error: 'Task not found' });
//       }

//       if (io) {
//         io.to(updatedTask.project.toString()).emit('task-updated', {
//           message: `Task "${updatedTask.title}" moved to ${status}`
//         });
//       }

//       res.json(updatedTask);
//     } catch (err) {
//       console.error('Error updating status:', err);
//       res.status(500).json({ error: err.message });
//     }
//   });

//   // POST /api/tasks/:id/comments
//   router.post('/:id/comments', async (req, res) => {
//     try {
//       const { userName, text } = req.body;

//       const task = await Task.findById(req.params.id);
//       if (!task) {
//         return res.status(404).json({ error: 'Task not found' });
//       }

//       task.comments.push({ userName, text });
//       await task.save();

//       if (io) {
//         io.to(task.project.toString()).emit('task-updated', {
//           message: `${userName} commented on "${task.title}"`
//         });
//       }

//       res.status(201).json(task);
//     } catch (err) {
//       console.error('Error adding comment:', err);
//       res.status(500).json({ error: err.message });
//     }
//   });

//   return router;
// };

const express = require('express');
const Task = require('../models/Task'); // Adjust path to your model

module.exports = function(io) {
  const router = express.Router();

  // GET tasks by project
  router.get('/project/:projectId', async (req, res) => {
    try {
      const tasks = await Task.find({ project: req.params.projectId });
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST create task
  router.post('/', async (req, res) => {
    try {
      const { title, description, project, assignedTo } = req.body;
      const task = new Task({ title, description, project, assignedTo });
      await task.save();
      
      io.to(project).emit('task-updated', { message: `New task "${title}" added!` });
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  // PUT edit task
  router.put('/:id', async (req, res) => {
    try {
      const { title, description, assignedTo } = req.body;
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { title, description, assignedTo },
        { new: true }
      );
      
      if (task) {
        io.to(task.project.toString()).emit('task-updated', { message: `Task "${title}" updated!` });
      }
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // DELETE single task
  router.delete('/:id', async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (task) {
        io.to(task.project.toString()).emit('task-updated', { message: 'Task deleted' });
      }
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // PATCH task status (Drag & Drop)
  router.patch('/:id/status', async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );
      
      if (task) {
        io.to(task.project.toString()).emit('task-updated', { message: `Task moved to ${req.body.status}` });
      }
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST comment on task
  router.post('/:id/comments', async (req, res) => {
    try {
      const { userName, text } = req.body;
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ error: 'Task not found' });

      task.comments.push({ userName, text });
      await task.save();

      io.to(task.project.toString()).emit('task-updated', { message: 'New comment added' });
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};