const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  emp_id: {
    type: mongoose.Types.ObjectId,
    ref: "employees",
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  reason_for_leave: {
    type: String,
  },
  status: {
    type: String,
  },
});

const Leave = mongoose.model("leave", leaveSchema);
module.exports = Leave;
