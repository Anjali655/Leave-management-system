const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.post("/admin-signup", authController.admin_signup);

router.get("/admin-login", authController.admin_login_get);

router.post("/admin-login", authController.admin_login_post);

router.get("/admin-dashboard", authController.admin_dashboard_get);

router.get("/add-emp", authController.add_emp_get);

router.post("/add-emp", authController.add_emp_post);

router.get("/manage-emp", authController.manage_emp_get);

router.get("/emp-login", authController.emp_login_get);

router.get("/emp-dashboard", authController.emp_dashboard_get);

router.post("/emp-login", authController.emp_login_post);

module.exports = router;
