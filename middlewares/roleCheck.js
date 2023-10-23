// middleware function to check if user has required role
function checkRole(role) {
  console.log("role+++++++++++++" + role);
  return function (req, res, next) {
    if (
      (req.body && role === "10000") ||
      role === "3000" ||
      role === "2000" ||
      role === "4000" ||
      role === "5000" ||
      role === "6000" ||
      role === "7000" ||
      role === "9000" ||
      role === "8000"
    ) {
      next(); // user has required role, so continue to next middleware
    } else {
      res.status(403).send("Forbidden"); // user doesn't have required role, so send forbidden status
    }
  };
}

function checkUserRole(role) {
  return function (req, res, next) {
    if ((req.body && role === "1000") || role === "2000") {
      next(); // user has required role, so continue to next middleware
    } else {
      res.status(403).send("Forbidden"); // user doesn't have required role, so send forbidden status
    }
  };
}

module.exports = { checkRole, checkUserRole };
