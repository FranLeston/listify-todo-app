const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("this is uri", process.env.MONGO_URI);
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan);
};

module.exports = connectDB;
