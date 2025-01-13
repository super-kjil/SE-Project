const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  create,
  update,
  remove,
} = require("../controller/dashboard.controller");
module.exports = (app) => {
  app.get("/api/dashboard", validate_token(), getList);
  // app.post("/api/customer", validate_token(), create);
  // app.put("/api/customer", validate_token(), update);
  // app.delete("/api/customer", validate_token(), remove);
};
