const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Todo = require("../models/Todo");
const Notebook = require("../models/Notebook");

// @desc    Get todos
// @route   GET /api/v1/todos
// @route   GET /api/v1/Notebooks/:notebookId/todos
// @access  Public

exports.getTodos = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.notebookId) {
    query = Todo.find({ notebook: req.params.notebookId });
  } else {
    query = Todo.find().populate("notebook");
  }

  const todos = await query;
  res.status(200).json({
    success: true,
    count: todos.length,
    data: todos,
  });
});

// // @desc    Get all todos
// // @route   GET /api/v1/todos
// // @access  Public
// exports.getTodos = asyncHandler(async (req, res, next) => {
//   const todos = await Todo.find().sort("-created_at");
//   res.status(200).json({
//     success: true,
//     count: todos.length,
//     data: todos,
//   });
// });

// @desc    Get single todo
// @route   GET /api/v1/todos/:id
// @access  Public
exports.getTodo = asyncHandler(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id).populate("notebook");

  if (!todo) {
    return next(
      new ErrorResponse(`Todo not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: todo,
  });
});

// @desc    Create Todo
// @route   POST /api/v1/notebook/:notebookId/todo
// @access  Public
exports.createTodo = asyncHandler(async (req, res, next) => {
  req.body.notebook = req.params.notebookId;

  const notebook = await Notebook.findById(req.params.notebookId);

  if (!notebook) {
    return next(
      new ErrorResponse(
        `No Notebook found with id of ${req.params.notebookId}`,
        404
      )
    );
  }

  const todo = await Todo.create(req.body);
  res.status(201).json({
    success: true,
    data: todo,
  });
});

// @desc    Update Todo
// @route   PUT /api/v1/todos/:id
// @access  Public
exports.updateTodo = asyncHandler(async (req, res, next) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!todo) {
    return next(
      new ErrorResponse(`Todo not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: todo,
  });
});

// @desc    Delete Todo
// @route   DELETE /api/v1/todos/:id
// @access  Public
exports.deleteTodo = asyncHandler(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return next(
      new ErrorResponse(`Todo not found with id of ${req.params.id}`, 404)
    );
  }
  await todo.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
