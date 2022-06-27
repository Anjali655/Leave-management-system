const Admin = require("../models/admin");
const Employee = require("../models/emp");
const jwt = require("jsonwebtoken");
const Leave = require("../models/leave");
const router = require("../routes/authRoutes");
const userVerificationCheck = require("../middleware/userVerificationCheck");

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

// async function userVerificationCheck(req, res, next) {
//   const cookieData = await req.cookies; // took cookie data
//   const jwtData = cookieData.jwt ?? ""; // got the jwt cookie from the cookie data

//   var decoded =
//     jwtData.maxAge === 0 ? null : jwt.verify(jwtData, "codeDrill secret"); // decoded the jwt token from the cookie data
//   var admin = decoded ? await Admin.findById(decoded?.id) : null; // taken the user id from the jwt and look for the user in the admin
//   var user = decoded ? await Employee.findById(decoded?.id) : null; // taken the user data from the jwt and look for the user in emp

//   if (admin) {
//     return {
//       type: "admin",
//       verified: true,
//     };
//   } else if (user) {
//     return {
//       type: "emp",
//       verified: true,
//     };
//   } else {
//     return {
//       type: undefined,
//       verified: false,
//     };
//   }
// }

// creating json web token

const maxAge = 3 * 24 * 60 * 60;
let emp_id = Leave.emp_id;
const createToken = (id) => {
  return jwt.sign({ id, emp_id: emp_id }, "codeDrill secret", {
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

module.exports.admin_login_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "admin" && check.verified === true) {
    res.render("admin-dashboard");
  } else {
    res.render("admin-login");
  }
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
  var check = await userVerificationCheck(req, res);
  // console.log(check, "check >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  if (check.type === "admin" && check.verified === true) {
    res.render("admin-dashboard");
  } else {
    res.render("admin-login");
  }
};

module.exports.add_emp_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "admin" && check.verified === true) {
    res.render("add-emp");
  }
};

module.exports.add_emp_post = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "admin" && check.verified === true) {
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
  }
};

module.exports.get_allemp = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "emp" && check.verified === true) {
    let allEmp = await Employee.find({});
    // console.log(allEmp);
    res.status(200).send(allEmp);
  }
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
    id: req.params.id,
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

module.exports.manage_emp_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "admin" && check.verified === true) {
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
  }
};

// onclick="approve(`<%= leave[i].emp.name %>`)"

module.exports.manage_leaves_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "admin" && check.verified === true) {
    let allleaves = await Leave.find({});
    let newLeaves = await Promise.all(
      allleaves.map(async (leave) => {
        let emp = await Employee.findById(leave.emp_id);

        return {
          leave: {
            id: leave._id,
            from: leave.from,
            to: leave.to,
            reason_for_leave: leave.reason_for_leave,
            status: leave.status,
          },
          emp: {
            name: emp ? emp.name : "N/A",
          },
        };
      })
    );
    // console.log(newLeaves, "newLeaves >>>>>>>>>>>");
    res.render("manage-leaves", { leave: newLeaves });
  }
};

module.exports.update_status_put = async (req, res) => {
  console.log(req.params.id);

  await Leave.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: req.body.status,
      },
    }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => console(err));
};

module.exports.emp_login_get = (req, res) => {
  res.render("emp-login");
};

module.exports.emp_dashboard_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "emp" && check.verified === true) {
    res.render("emp-dashboard");
  } else {
    res.render("emp-login");
  }
};

module.exports.emp_login_post = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    const employee = await Employee.login(email, password);
    const token = createToken(employee._id);
    console.log(token);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ employee: employee._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(404).json({ errors });
  }
};

module.exports.apply_leave_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "emp" && check.verified === true) {
    let allleaves = await Leave.find({});
    let newLeaves = await Promise.all(
      allleaves.map((leave) => {
        return {
          from: leave.from,
          to: leave.to,
          reason_for_leave: leave.reason_for_leave,
          status: leave.status,
        };
      })
    );

    res.render("apply-leave", { leave: newLeaves });
  }
};

module.exports.my_leaves_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "emp" && check.verified === true) {
    let allleaves = await Leave.find({});
    let newLeaves = await Promise.all(
      allleaves.map((leave) => {
        return {
          from: leave.from,
          to: leave.to,
          reason_for_leave: leave.reason_for_leave,
        };
      })
    );
    res.render("my-leaves", { leave: newLeaves });
  }
};

module.exports.apply_leave_form_get = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "emp" && check.verified === true) {
    res.render("applyleaveform");
  }
};

module.exports.apply_leave_form_post = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "emp" && check.verified === true) {
    const cookieData = req.cookies;
    const jwtData = cookieData.jwt;
    var decoded = jwt.verify(jwtData, "codeDrill secret");
    // console.log(decoded, "decoded >>>>>>>>>>>>>");

    const { from, to, reason_for_leave } = req.body;
    //console.log(from, "from>>>>>>>>");
    var startDate = from.split("-").reverse().join("-");
    // const hello = toString(from.split("-").reverse().join("-"));
    // console.log(hello, "hello");
    var endDate = to.split("-").reverse().join("-");
    // console.log(toString(startDate), "startDate>>>>>>>>>>>>>>>");
    try {
      // let leave = Leave.create({ from: newFrom, to: newTo, reason_for_leave });
      let leave = await Leave.create({
        emp_id: decoded.id,
        from: startDate,
        to: endDate,
        reason_for_leave: reason_for_leave,
        status: "Pending",
      });
      // console.log(leave, "leave >>>>>>>>>>>>>>>>>>>>>>");
      res.status(200).json({ leave });
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
    }
  }
};

module.exports.get_allleaves = async (req, res) => {
  var check = await userVerificationCheck(req, res);
  if (check.type === "emp" && check.verified === true) {
    let allleaves = await Leave.find({});
    console.log(allleaves);
    res.status(200).json({ leaves: allleaves });
  }
};

module.exports.admin_logout = async (req, res) => {
  res.cookie("jwt", { maxAge: 0 });
  res.redirect("/admin-login");
};

module.exports.emp_logout = async (req, res) => {
  res.cookie("jwt", { maxAge: 0 });
  res.redirect("emp-login");
};
