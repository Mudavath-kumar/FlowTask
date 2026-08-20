const mongoose = require('mongoose');
const Task = require('../models/Task');

// Priority weighting helper for in-memory or query sorting if needed
const priorityWeight = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// @desc    Get all tasks for current user with search, filter, sort, and pagination
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user._id };

    // Search by title (case-insensitive)
    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    // Filter by status
    if (status && ['Todo', 'In Progress', 'Done'].includes(status)) {
      query.status = status;
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    // Sorting
    let sortOption = {};
    const sortOrder = order.toLowerCase() === 'asc' ? 1 : -1;

    if (sort === 'dueDate') {
      // For due date sorting, tasks with null/undefined due dates should be sorted cleanly
      sortOption = { dueDate: sortOrder, createdAt: -1 };
    } else if (sort === 'priority') {
      // Mongoose doesn't do enum custom weight sorting directly in simple sort, so we can sort by priority text or use createdAt fallback
      sortOption = { priority: sortOrder, createdAt: -1 };
    } else {
      sortOption = { [sort]: sortOrder };
    }

    const total = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber) || 1;

    return res.json({
      success: true,
      tasks,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      user: req.user._id,
    };

    if (status && ['Todo', 'In Progress', 'Done'].includes(status)) {
      taskData.status = status;
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      taskData.priority = priority;
    }

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const task = await Task.create(taskData);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty',
        });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description ? description.trim() : '';
    }

    if (status !== undefined) {
      if (!['Todo', 'In Progress', 'Done'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value',
        });
      }
      task.status = status;
    }

    if (priority !== undefined) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid priority value',
        });
      }
      task.priority = priority;
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const updatedTask = await task.save();

    return res.json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quickly update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    if (!status || !['Todo', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Todo, In Progress, or Done.',
      });
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.status = status;
    const updatedTask = await task.save();

    return res.json({
      success: true,
      message: `Task status updated to ${status}`,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    return res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task analytics for authenticated user
// @route   GET /api/tasks/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalTasks, completedTasks, todoTasks, inProgressTasks, lowTasks, mediumTasks, highTasks] =
      await Promise.all([
        Task.countDocuments({ user: userId }),
        Task.countDocuments({ user: userId, status: 'Done' }),
        Task.countDocuments({ user: userId, status: 'Todo' }),
        Task.countDocuments({ user: userId, status: 'In Progress' }),
        Task.countDocuments({ user: userId, priority: 'Low' }),
        Task.countDocuments({ user: userId, priority: 'Medium' }),
        Task.countDocuments({ user: userId, priority: 'High' }),
      ]);

    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage =
      totalTasks > 0 ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(1)) : 0;

    return res.json({
      success: true,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionPercentage,
      statusBreakdown: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: completedTasks,
      },
      priorityBreakdown: {
        low: lowTasks,
        medium: mediumTasks,
        high: highTasks,
      },
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
  updateTaskStatus,
  deleteTask,
  getAnalytics,
};
