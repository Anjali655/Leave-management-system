const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const empSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
    lowercase: true,
  },
});

// Mongoose Hooks:
// function after a document is saved to db
empSchema.post("save", function (doc, next) {
  console.log("new emp is created & saved", doc);
  next();
});

// function before a document is saved to db
empSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login employee
empSchema.statics.login = async function (email, password) {
  const employee = await this.findOne({ email });
  if (employee) {
    const auth = await bcrypt.compare(password, employee.password);
    if (auth) {
      return employee;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

let Employee = mongoose.model("employee", empSchema);

module.exports = Employee;
