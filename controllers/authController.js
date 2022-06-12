// const Admin = require("../models/admin");
const Employee = require("../models/emp");
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  console.error(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "That password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "That email is already registered!";
    return errors;
  }

  // validate errors
  if (err.message.includes("employee validation failed")) {
    console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// creating json web token
const maxAge = 1 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "codeDrill secret", {
    expiresIn: maxAge,
  });
};

//Controller actions

// module.exports.admin_login_get = (req, res) => {
//   res.render("admin-login");
// };

// module.exports.admin_login_post = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await Admin.create({ email, password });
//     res.status(200).json(admin);
//   } catch (err) {
//     const errors = handleErrors(err);
//     res.status(400).json({ errors });
//   }
// };

module.exports.add_emp_get = (req, res) => {
  res.render("add-emp");
};

module.exports.add_emp_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    let employee = await Employee.create({ email, password });
    const token = createToken(employee._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ employee: employee._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.manage_emp_get = async (req, res) => {
  res.render("manage-emp");
};

module.exports.emp_login_get = (req, res) => {
  res.render("emp-login");
};

module.exports.emp_dashboard_get = (req, res) => {
  res.render("emp-dashboard");
};

module.exports.emp_login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.login(email, password);
    res.status(200).json({ employee: employee._id });
  } catch (err) {
    res.status(404).json("employee not exists");
  }
};
