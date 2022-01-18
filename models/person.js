const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;
console.log("connected to", url);

//connect to mongoose

mongoose
  .connect(url)
  .then((res) => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log("error connecting", err.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
