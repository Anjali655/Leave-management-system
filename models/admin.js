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
    lowercase: true,
  },
});

// Mongoose Hooks:
// before saving document to the db 
adminSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password,salt);
  next();
});

// after saving document to the db 
adminSchema.post('save', async function(doc,next){
console.log("admin credentials saved to db successfully", doc);
  next();
});

let Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
