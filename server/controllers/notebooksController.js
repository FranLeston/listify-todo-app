const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Notebook = require("../models/Notebook");

// @desc    Get all Notebooks
// @route   GET /api/v1/Notebooks
// @access  Public
exports.getNotebooks = asyncHandler(async (req, res, next) => {
  const notebooks = await Notebook.find().populate("todos").sort("-created_at");
  res.status(200).json({
    success: true,
    count: notebooks.length,
    data: notebooks,
  });
});

// @desc    Get single notebook
// @route   GET /api/v1/Notebooks/:id
// @access  Public
exports.getNotebook = asyncHandler(async (req, res, next) => {
  const notebook = await Notebook.findById(req.params.id);

  if (!notebook) {
    return next(
      new ErrorResponse(`NoteBook not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: notebook,
  });
});

// @desc    Create Notebook
// @route   POST /api/v1/Notebooks
// @access  Public
exports.createNotebook = asyncHandler(async (req, res, next) => {
  const notebook = await Notebook.create(req.body);
  res.status(201).json({
    success: true,
    data: notebook,
  });
});

// @desc    Create User Notebook
// @route   POST /api/v1/Notebooks/user
// @access  Private
exports.createUserNotebook = asyncHandler(async (req, res, next) => {
  //add user to req.body
  req.body.user = req.user.id;
  req.body.type = "registered";
  const notebook = await Notebook.create(req.body);
  res.status(201).json({
    success: true,
    data: notebook,
  });
});

// @desc    Update Todo
// @route   PUT /api/v1/Notebooks/:id
// @access  Public
exports.updateNotebook = asyncHandler(async (req, res, next) => {
  const notebook = await Notebook.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!notebook) {
    return next(
      new ErrorResponse(`Notebook not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: notebook,
  });
});

// @desc    Delete Notebook
// @route   PUT /api/v1/Notebooks/:id
// @access  Public
exports.deleteNotebook = asyncHandler(async (req, res, next) => {
  const notebook = await Notebook.findById(req.params.id);

  if (!notebook) {
    return next(
      new ErrorResponse(`Notebook not found with id of ${req.params.id}`, 404)
    );
  }

  notebook.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
