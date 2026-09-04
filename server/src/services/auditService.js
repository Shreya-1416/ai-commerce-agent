const AuditLog = require("../models/AuditLog");

const logAudit = async ({
  sessionId,
  action,
  tool = null,
  status = "completed",
  details = {},
}) => {
  try {
    const log = await AuditLog.create({
      sessionId,
      action,
      tool,
      status,
      details,
    });

    return log;
  } catch (error) {
    console.error("Audit log error:", error);

    // Audit logging should never break the shopping flow.
    return null;
  }
};

module.exports = {
  logAudit,
};