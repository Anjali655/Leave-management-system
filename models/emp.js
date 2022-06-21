const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const empSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "google",
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
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
  },
  mobile: {
    type: Number,
    required: true,
  },
});

// Mongoose Hooks:

// function before a document is saved to db
empSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
  // console.log(this.password);
  // bcrypt.genSalt(saltRounds, function (err, salt) {
  //   bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
  // Store hash in your password DB.
  //     console.log(hash);
  //   });
  // });
});

// function after a document is saved to db
empSchema.post("save", function (doc, next) {
  console.log("new emp is created & saved", doc);
  next();
});

// static method to login employee
empSchema.statics.login = async function (email, password) {
  const employee = await this.findOne({ email });
  // console.log(employee.password, "employee>>>");
  if (employee) {
    //  bcrypt.compare(password, employee.password, function (err, res) {
    //     console.log(res);
    //   });

    const auth = await bcrypt.compare(password, employee.password);
    // const auth = await bcrypt.compareSync(password, employee.password);
    // console.log(
    //   bcrypt.compareSync(password, employee.password),
    //   "auth>>>>>>>>>>>>>>>>>>>>>>>"
    // );
    // const auth = true;
    if (auth) {
      return employee;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

let Employee = mongoose.model("employee", empSchema);

module.exports = Employee;
