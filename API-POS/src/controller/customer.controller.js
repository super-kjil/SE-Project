const { logError, db } = require("../util/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../util/config");

exports.getList = async (req, res) => {
  try {
    let sql = "SELECT * FROM customer";
    const [list] = await db.query(sql);
    res.json({
      list,
    });
  } catch (error) {
    logError("customer.getList", error, res);
  }
};

// name, tel, email, password, image, address
exports.register = async (req, res) => {
  try {
    // hash password
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10);
    let sql = `INSERT INTO  
       customer ( name, tel, email, password, image, address) VALUES 
       (:name, :tel, :email, :password, :image, :address)`;

    let data = await db.query(sql, {
      name: req.body.name,
      tel: req.body.tel,
      email: req.body.email,
      password: password,
      address: req.body.address,
      image: req.file?.filename,
    });
    res.json({
      message: "Create new account success!",
      data: data,
    });
  } catch (error) {
    logError("customer.register", error, res);
  }
};

exports.login = async (req, res) => {
  try {
    let { password, username } = req.body;
    let sql = "SELECT * FROM customer WHERE username=:username ";
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
          customerProfile: data[0],
          // permission: await getPermissionByUser(data[0].id),
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
// const getPermissionByUser = async (user_id) => {
//   let sql =
//     "SELECT " +
//     " DISTINCT  " +
//     "   p.id," +
//     "   p.name," +
//     "   p.group," +
//     "   p.is_menu_web," +
//     "   p.web_route_key" +
//     " FROM permissions AS p" +
//     " INNER JOIN permission_roles AS pr on p.id = pr.permission_id" +
//     " INNER JOIN role AS r on pr.role_id = r.id" +
//     " INNER JOIN user_roles AS ur on r.id = ur.role_id" +
//     " WHERE ur.user_id = :user_id ";
//   const [permission] = await db.query(sql, { user_id });
//   return permission;
// };

exports.customerProfile = async (req, res) => {
  try {
    res.json({
      customerProfile: req.customerProfile,
    });
  } catch (error) {
    logError("customer.register", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10);
    var sql = `UPDATE customer 
      SET 
        name =:name, 
        email =:email, 
        password =:password, 
        address =:address, 
        tel =:tel,
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
      create_by: req.customer?.name,
    });
    res.json({
      data: data,
      message: "Data Update Success!",
    });
  } catch (error) {
    logError("customer.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM customer WHERE id = :id", {
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
    logError("customer.remove", error, res);
  }
};

exports.validate_token_customer = () => {
  // call in midleware in route (role route, user route, route)
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
            req.current_id = result.data.customerProfile.id;
            req.customer = result.data.customerProfile; // write user property
            // req.permission = result.data.permission; // write user property
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
    config.config.token.access_token_key
    // {
    //   expiresIn: "1d",
    // }
  );
  return acess_token;
};

// getpermission menu
// getpermission role
