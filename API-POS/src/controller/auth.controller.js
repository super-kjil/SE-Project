const { logError, db } = require("../util/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");

exports.getList = async (req, res) => {
  try {
    let sql =
      " SELECT  " +
      " u.id, " +
      " u.name, " +
      " u.username, " +
      " u.create_by, " +
      " u.image, " +
      " u.is_active, " +
      " r.name AS role_name " +
      " FROM user u " +
      " INNER JOIN role r ON u.role_id = r.id ";
    const [list] = await db.query(sql);
    const [role] = await db.query(
      "SELECT id as value, name as label FROM role"
    );
    res.json({
      list,
      role,
    });
  } catch (error) {
    logError("auth.getList", error, res);
  }
};

exports.register = async (req, res) => {
  try {
    // hash password
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10); // 123456, "314098spofaspdofjpo2rlsjlfasdf"
    let sql =
      "INSERT INTO " +
      " user ( role_id, name, username, password, is_active,image , create_by) VALUES " +
      " (:role_id,:name,:username,:password,:is_active,:image ,:create_by); ";
    let data = await db.query(sql, {
      // ...req.body,
      // id: req.body.id,
      role_id: req.body.role_id,
      name: req.body.name,
      username: req.body.username,
      password: password,
      is_active: req.body.is_active,
      image: req.file?.filename,
      create_by: req.auth?.name, // current user that action this module
    });
    res.json({
      message: "Create new account success!",
      data: data,
    });
  } catch (error) {
    logError("auth.register", error, res);
  }
};

exports.login = async (req, res) => {
  try {
    let { password, username } = req.body;
    // let sql = "SELECT * FROM user WHERE username=:username ";
    let sql =
      "SELECT " +
      " u.*," +
      " r.name as role_name" +
      " FROM user u " +
      " INNER JOIN role r ON u.role_id = r.id " +
      " WHERE u.username=:username ";

    let [data] = await db.query(sql, {
      username: username,
    });
    if (data.length == 0) {
      // alert(JSON.stringify(error));
      res.json({
        error: {
          username: "Username doesn't exist!",
        },
      });
    } else {
      let dbPass = data[0].password;
      let isCorrectPass = bcrypt.compareSync(password, dbPass); // true | false
      if (!isCorrectPass) {
        res.json({
          error: {
            password: "Password incorrect!",
          },
        });
      } else {
        delete data[0].password;
        let obj = {
          profile: data[0],
          permission: await getPermissionByUser(data[0].id),
        };
        res.json({
          message: "Login success",
          ...obj,
          access_token: await getAccessToken(obj),
        });
      }
    }
  } catch (error) {
    logError("auth.login", error, res);
  }
};

const getPermissionByUser = async (user_id) => {
  let sql =
    "SELECT " +
    " DISTINCT  " +
    "   p.id," +
    "   p.name," +
    "   p.group," +
    "   p.is_menu_web," +
    "   p.web_route_key" +
    " FROM permissions AS p" +
    " INNER JOIN permission_roles AS pr on p.id = pr.permission_id" +
    " INNER JOIN role AS r on pr.role_id = r.id" +
    " INNER JOIN user_roles AS ur on r.id = ur.role_id" +
    " WHERE ur.user_id = :user_id ";
  const [permission] = await db.query(sql, { user_id });
  return permission;
};

exports.profile = async (req, res) => {
  try {
    res.json({
      profile: req.profile,
    });
  } catch (error) {
    logError("auth.register", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10);
    var sql = `UPDATE user 
      SET role_id =:role_id, 
        name =:name, 
        username =:username, 
        password =:password, 
        is_active =:is_active,
        image = :image 
      WHERE id =:id `;

    var filename = req.body.image;
    /// image new
    if (req.file) {
      filename = req.file?.filename;
    }

    /// image change
    if (
      req.body.image != "" &&
      req.body.image != null &&
      req.body.image != "null" &&
      req.file
    ) {
      removeFile(req.body.image); // remove old image
      filename = req.file?.filename;
    }

    /// image remove
    if (req.body.image_remove == "1") {
      removeFile(req.body.image); // remove image
      filename = null;
    }

    var [data] = await db.query(sql, {
      ...req.body,
      password: password,
      image: filename,
      create_by: req.auth?.name,
    });
    res.json({
      data: data,
      message: "Data Update Success!",
    });
  } catch (error) {
    logError("user.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM user WHERE id = :id", {
      id: req.body.id, // null
    });
    if (data.affectedRows && req.body.image != "" && req.body.image != null) {
      removeFile(req.body.image);
    }
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("user.remove", error, res);
  }
};

exports.validate_token = (permission_name) => {
  // call in midleware in route (role route, user route, teacher route)
  return (req, res, next) => {
    var authorization = req.headers.authorization; // token from client
    var token_from_client = null;
    if (authorization != null && authorization != "") {
      token_from_client = authorization.split(" "); // authorization : "Bearer lkjsljrl;kjsiejr;lqjl;ksjdfakljs;ljl;r"
      token_from_client = token_from_client[1]; // get only access_token
    }
    if (token_from_client == null) {
      res.status(401).send({
        message: "Unauthorized",
      });
    } else {
      jwt.verify(
        token_from_client,
        config.config.token.access_token_key,
        (error, result) => {
          if (error) {
            res.status(401).send({
              message: "Unauthorized",
              error: error,
            });
          } else {
            if (permission_name) {
              let findIndex = result.data.permission?.findIndex(
                (item) => item.name == permission_name
              );
              if (findIndex == -1) {
                res.status(401).send({
                  message: "Unauthorized",
                  error: error,
                });
                return;
              }
            }
            req.current_id = result.data.profile.id;
            req.auth = result.data.profile; // write user property
            req.permission = result.data.permission; // write user property
            next(); // continue controller
          }
        }
      );
    }
  };
};

const getAccessToken = async (paramData) => {
  const acess_token = await jwt.sign(
    { data: paramData },
    config.config.token.access_token_key,
    {
      expiresIn: "1d",
    }
  );
  return acess_token;
};

// getpermission menu
// getpermission role
