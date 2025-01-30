const {
  getList,
  register,
  login,
  customerProfile,
  validate_token_customer,
  update,
  remove,
} = require("../controller/customer.controller");
const { validate_token } = require("../controller/auth.controller");
const { uploadFile } = require("../util/helper");

module.exports = (app) => {
  app.get(
    "/api/customer",
    validate_token_customer() || validate_token(),
    getList
  );
  app.post(
    "/api/customer/register",
    validate_token_customer(),
    uploadFile.single("upload_image"),
    register
  );
  app.post("/api/customer/login", login);
  app.post(
    "/api/customer/customerProfile",
    validate_token_customer(),
    customerProfile
  );
  app.put(
    "/api/customer/register",
    validate_token_customer(),
    uploadFile.single("upload_image"),
    update
  );
  app.delete("/api/customer/remove-profile", validate_token_customer(), remove);
};
// validate_token_customer(),
