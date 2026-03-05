import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
try {
    // 1. Create a new task instance 
    // We spread the body and add the owner from req.user
    const task = new Task({
      ...req.body,
      owner: req.user._id
    });

    // 2. Save the task to the database
    await task.save();

    // 3. Send back the created task with a 201 (Created) status
    res.status(201).send(task);
  } catch (error) {
    // Handle validation or connection errors
    res.status(400).send({ error: error.message });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    // Assuming you have middleware that attaches the logged-in user to req.user
    const userId = req.user._id; 

    // 1. Check ownership
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task's user ID matches the current user's ID
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "User not authorized to delete this task" });
    }

    // 2. Delete task
    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully", id: taskId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;