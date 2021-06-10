var express = require("express");
const {
  getTodos,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todosController");

var router = express.Router({ mergeParams: true });

router.route("/").get(getTodos).post(createTodo);

router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

module.exports = router;
