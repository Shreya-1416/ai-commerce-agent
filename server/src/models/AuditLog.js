const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
    },

    tool: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["started", "completed", "failed"],
      default: "completed",
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);