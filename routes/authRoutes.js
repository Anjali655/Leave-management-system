const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.post("/admin-signup", authController.admin_signup);

router.get("/admin-login", authController.admin_login_get);

router.post("/admin-login", authController.admin_login_post);

router.get("/admin-dashboard", authController.admin_dashboard_get);

router.get("/add-emp", authController.add_emp_get);

router.post("/add-emp", authController.add_emp_post);

router.get("/get-allemp", authController.get_allemp);

router.get("/get-emp/:id", authController.get_emp);

router.delete("/delete-emp/:id", authController.delete_emp);

router.get("/update-emp/:id", authController.update_emp_get);

router.put("/update-emp/:id", authController.update_emp_put);

router.get("/manage-emp", authController.manage_emp_get);

router.get("/manage-leaves", authController.manage_leaves_get);

router.put("/update-status/:id", authController.update_status_put);

router.get("/emp-login", authController.emp_login_get);

router.post("/emp-login", authController.emp_login_post);

router.get("/emp-dashboard", authController.emp_dashboard_get);

router.get("/apply-leave", authController.apply_leave_get);

router.get("/my-leaves", authController.my_leaves_get);

router.get("/applyleaveform", authController.apply_leave_form_get);

router.post("/applyleaveform", authController.apply_leave_form_post);

router.get("/get-leaves", authController.get_allleaves);

module.exports = router;
