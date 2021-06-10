const mongoose = require("mongoose");
const getRandomString = require("../utils/rndStringGen");

const NotebookSchema = new mongoose.Schema(
  {
    notebook_name: {
      type: String,
      maxlength: [15, "15 chars limit"],
      unique: true,
    },
    title: {
      type: String,
      maxlength: [50, "50 chars limit"],
      default: "To-do " + new Date(Date.now()).toDateString(),
    },
    type: {
      type: String,
      enum: ["anonymous", "registered"],
      default: "anonymous",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

NotebookSchema.pre("save", async function (next) {
  //Generate a random list name
  var rndName;
  var count = 1;
  while (count > 0) {
    rndName = getRandomString(15);
    count = await Notebook.find({ notebook_name: rndName })
      .countDocuments()
      .exec();
    console.log("Count is ", count);
  }

  this.notebook_name = rndName;

  next();
});

//Cascade delete todos when notebook is deleted
NotebookSchema.pre("remove", async function (next) {
  console.log(`todos being removed from notebook ${this._id}`);
  await this.model("Todo").deleteMany({ notebook: this._id });
  next();
});

//Reverse populate with virtuals
NotebookSchema.virtual("todos", {
  ref: "Todo",
  localField: "_id",
  foreignField: "notebook",
  justOne: false,
});

const Notebook = mongoose.model("Notebook", NotebookSchema);
module.exports = Notebook;
