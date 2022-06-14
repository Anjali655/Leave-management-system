const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Please enter an email"],
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum Password length is 6 characters"],
  },
});

// Mongoose Hooks:
// before saving document to the db
adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// after saving document to the db
adminSchema.post("save", async function (doc, next) {
  console.log("admin credentials saved to db successfully", doc);
  next();
});

// static method to login admin
adminSchema.statics.login = async function (email, password) {
  const admin = await this.findOne({ email });
  if (admin) {
    const auth = await bcrypt.compare(password, admin.password);
    console.log(auth);
    if (auth) {
      return admin;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

let Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
