const { validate_token } = require("../controller/auth.controller");
const {
  getListEpenseType,
  getList,
  create,
  update,
  remove,
} = require("../controller/expense.controller");
module.exports = (app) => {
  app.get(
    "/api/expense_type",
    validate_token("expense_type.get_list"),
    getListEpenseType
  );
  app.get("/api/expense", validate_token("expense.get_list"), getList);
  app.post("/api/expense", validate_token(), create);
  app.put("/api/expense", validate_token(), update);
  app.delete("/api/expense", validate_token(), remove);
};
