var express = require("express");
const {
  getNotebooks,
  createNotebook,
  createUserNotebook,
  getNotebook,
  updateNotebook,
  deleteNotebook,
} = require("../controllers/notebooksController");

//Include other resource routers
const todoRouter = require("./todos");

var router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:notebookId/todos", todoRouter);

//example of protected route:
//router.route("/").post(protect, authorize('admin'),createNotebook);
router.route("/user").post(protect, createUserNotebook);

router.route("/").get(getNotebooks).post(createNotebook);

router
  .route("/:id")
  .get(getNotebook)
  .put(updateNotebook)
  .delete(deleteNotebook);

module.exports = router;
