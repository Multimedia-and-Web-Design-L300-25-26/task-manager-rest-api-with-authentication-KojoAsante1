const Task = require('../models/Task'); // Import your Task model

// 1. Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};

// 2. Create a new task
exports.createTask = async (req, res) => {
    try {
        const newTask = new Task(req.body); // Assumes body has 'title', 'desc', etc.
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: "Error creating task", error });
    }
};

// 3. Update a task (e.g., mark as completed)
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Returns the modified document rather than the original
        );
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: "Update failed", error });
    }
};

// 4. Delete a task
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error });
    }
};