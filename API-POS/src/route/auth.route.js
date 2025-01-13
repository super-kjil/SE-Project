const {
  getList,
  register,
  login,
  profile,
  validate_token,
  update,
  remove,
} = require("../controller/auth.controller");
const { uploadFile } = require("../util/helper");

module.exports = (app) => {
  app.get("/api/auth/get-list",validate_token(), getList);
  app.post("/api/auth/register",validate_token(),uploadFile.single("upload_image"),register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/profile", validate_token(), profile);
  app.put("/api/auth/register",validate_token(),uploadFile.single("upload_image"), update);
  app.delete("/api/auth/remove-profile",validate_token(), remove);
};
// validate_token(),