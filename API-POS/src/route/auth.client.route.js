const { validate_token } = require("../controller/auth.controller");
const {
  getList,
  register,
  update,
  login,
  remove,
  profile,
} = require("../controller/auth.client.controller");
const { uploadFile } = require("../util/helper");

module.exports = (app) => {
  app.get("/api/auth-client/get-list", validate_token(), getList);
  app.post(
    "/api/auth-client/register",
    validate_token(),
    uploadFile.single("user_photo"),
    register
  );
  app.post("/api/auth-client/login", login);
  app.post("/api/auth-client/profile", validate_token(), profile);
  app.put(
    "/api/auth-client/register",
    validate_token(),
    uploadFile.single("user_photo"),
    update
  );
  app.delete("/api/auth-client/remove-profile", validate_token(), remove);
};
