const Admin = require("../models/admin");
const Employee = require("../models/emp");
const jwt = require("jsonwebtoken");
const Leave = require("../models/leave");
const { find } = require("../models/admin");
const router = require("../routes/authRoutes");

// handle errors
const handleErrors = (err) => {
  console.log(err);
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
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "codeDrill secret", {
    expiresIn: maxAge,
  });
};

//Controller actions

module.exports.admin_signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Admin.create({ email, password });
    res.status(200).json({ admin: admin });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports.admin_login_get = (req, res) => {
  res.render("admin-login");
};

module.exports.admin_login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.login(email, password);
    let token = createToken(admin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ admin: admin });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.admin_dashboard_get = async function (req, res) {
  res.render("admin-dashboard");
};

module.exports.add_emp_get = (req, res) => {
  res.render("add-emp");
};

module.exports.add_emp_post = async (req, res) => {
  const { name, department, email, password, mobile } = req.body;

  // console.log(req.body);
  try {
    let employee = await Employee.create({
      name,
      department,
      email,
      password,
      mobile,
    });

    res.status(200).json({ employee: employee._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.get_allemp = async (req, res) => {
  let allEmp = await Employee.find({});
  // console.log(allEmp);
  res.status(200).send(allEmp);
};

module.exports.get_emp = async (req, res) => {
  let user = await Employee.findById(req.params.id);
  // console.log(user);
  res.status(200).send(user);
};

module.exports.delete_emp = async (req, res) => {
  Employee.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
  res.render("manage-emp");
};

module.exports.update_emp_get = async (req, res) => {
  let emp = await Employee.findById(req.params.id);

  let Data = {
    name: emp.name,
    department: emp.department,
    email: emp.email,
    mobile: emp.mobile,
  };
  // console.log({ emp: Data }, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  res.render("update-emp", { emp: Data });
};

module.exports.update_emp_put = async (req, res) => {
  await Employee.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        department: req.body.department,
        email: req.body.email,
        mobile: req.body.mobile,
      },
    }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
};

module.exports.update_emp_put = async (req, res) => {
  let allEmp = await Employee.findById(id);

  let newData = await Promise.all(
    allEmp.map((emp) => {
      return {
        name: emp.name,
        department: emp.department,
        email: emp.email,
        mobile: emp.mobile,
      };
    })
  );
  res.render("manage-emp", { emp: newData });
};

module.exports.manage_emp_get = async (req, res) => {
  let allEmp = await Employee.find({});

  let newData = await Promise.all(
    allEmp.map((emp) => {
      return {
        _id: emp._id.toString(),
        name: emp.name,
        department: emp.department,
        email: emp.email,
        mobile: emp.mobile,
      };
    })
  );
  res.render("manage-emp", { emp: newData });
};

module.exports.manage_leaves_get = async (req, res) => {
  res.render("manage-leaves");
};

module.exports.emp_login_get = (req, res) => {
  res.render("emp-login");
};

module.exports.emp_dashboard_get = (req, res) => {
  res.render("emp-dashboard");
};

module.exports.emp_login_post = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    const employee = await Employee.login(email, password);
    const token = createToken(employee._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ employee: employee._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.apply_leave_get = async (req, res) => {
  let allleaves = await Leave.find({});
  let newLeaves = await Promise.all(
    allleaves.map((leave) => {
      // console.log(typeof leave.from);
      // console.log(typeof leave.to);
      return {
        from: leave.from,
        to: leave.to,
        reason_for_leave: leave.reason_for_leave,
      };
    })
  );

  res.render("apply-leave", { leave: newLeaves });
};

module.exports.my_leaves_get = async (req, res) => {
  let allleaves = await Leave.find({});
  let newLeaves = await Promise.all(
    allleaves.map((leave) => {
      // console.log(typeof leave.from);
      // console.log(typeof leave.to);
      return {
        from: leave.from,
        to: leave.to,
        reason_for_leave: leave.reason_for_leave,
      };
    })
  );
  res.render("my-leaves", { leave: newLeaves });
};

module.exports.apply_leave_form_get = (req, res) => {
  res.render("applyleaveform");
};

module.exports.apply_leave_form_post = async (req, res) => {
  const { from, to, reason_for_leave } = req.body;
  // console.log(from);
  // console.log(to);
  // console.log(reason_for_leave);
  const newFrom = new Date(Date.parse(from));
  const newTo = new Date(Date.parse(to));
  // const newFrom = new Date(from);
  // const newTo = new Date(to);
  // console.log(typeof "05/01/2020", typeof to, newFrom, newTo);
  // console.log(from, to);
  try {
    // let leave = Leave.create({ from: newFrom, to: newTo, reason_for_leave });
    let leave = await Leave.create({
      from: newFrom,
      to: newTo,
      reason_for_leave,
    });
    res.status(200).json({ leave });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

module.exports.get_allleaves = async (req, res) => {
  let allleaves = await Leave.find({});
  console.log(allleaves);
  res.status(200).json({ leaves: allleaves });
};
