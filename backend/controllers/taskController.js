
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Get tasks belonging to the logged-in user
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get one task belonging to the logged-in user
const getTaskById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Create a task for the logged-in user
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      dueDate: dueDate || null,
      user: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Update a task belonging to the logged-in user
const updateTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const { title, description, status, dueDate } = req.body;
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title cannot be empty"
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (status !== undefined) {
      updates.status = status;
    }

    if (dueDate !== undefined) {
      updates.dueDate = dueDate || null;
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// Delete a task belonging to the logged-in user
const deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task removed"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
