const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  reason_for_leave: {
    type: String,
  },
  //   Status: {
  //     type: String,
  //   },
});

const Leave = mongoose.model("leave", leaveSchema);
module.exports = Leave;
