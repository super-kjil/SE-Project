const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    let txtSearch = req.query.txtSearch;
    let from_date = req.query.from_date;
    let to_date = req.query.to_date;
    //Sql SELCT
    let sqlSelect =
      "SELECT " +
      "o.*, c.name customer_name, c.tel customer_tel, c.address customer_address ";
    //Sql JOIN
    let sqlJoin =
      "FROM `order` o LEFT JOIN customer c ON o.customer_id = c.id ";
    //Sql WHERE
    let sqlWhere = "WHERE true";
    //Search Filter block
    if (!isEmpty(txtSearch)) {
      sqlWhere += " AND (o.order_no LIKE :txtSearch OR c.tel LIKE :txtSearch)";
    }
    //Fromdate Todate Filter block
    if (!isEmpty(from_date) && !isEmpty(to_date)) {
      sqlWhere +=
        " AND DATE_FORMAT(o.create_at,'%Y-%m-%d') BETWEEN :from_date AND :to_date";
    }
    //Sql ORDER BY
    let sqlOrderBy = " ORDER BY o.id DESC";
    //sql final List
    let sqlList = sqlSelect + sqlJoin + sqlWhere + sqlOrderBy;
    //sql final Summary
    let sqlSummary =
      "SELECT COUNT(o.id) total_order, SUM(o.total_amount) total_amount " +
      sqlJoin +
      sqlWhere;
    //Param for sql
    let sqlParam = {
      txtSearch: "%" + txtSearch + "%",
      from_date: from_date,
      to_date: to_date,
    };
    const [list] = await db.query(sqlList, sqlParam);
    const [summary] = await db.query(sqlSummary, sqlParam);

    res.json({
      list: list,
      summary: summary[0],
    });
  } catch (error) {
    logError("order.getList", error, res);
  }
};
exports.getone = async (req, res) => {
  try {
    let sql = `
SELECT 
    od.*,
    p.name AS p_name,
    p.brand AS p_brand,
    p.image p_image,
    p.description AS p_desc,
    c.name AS p_category_name
FROM order_detail od
INNER JOIN product p ON od.proudct_id = p.id
INNER JOIN category c ON p.category_id = c.id
WHERE od.order_id = :id

    `;
    const [list] = await db.query(sql, { id: req.params.id });
    res.json({
      list: list,
    });
  } catch (error) {
    logError("order.getone", error, res);
  }
};
exports.create = async (req, res) => {
  try {
    var { order, order_details = [] } = req.body;
    // validate data
    order = {
      ...order,
      order_no: await newOrderNo(), // gener order_no
      user_id: req.auth?.id, // currect access
      create_by: req.auth?.name, // currect access
    };
    var sqlOrder =
      "INSERT INTO `order` (order_no,customer_id,total_amount,paid_amount,payment_method,remark,user_id,create_by) VALUES (:order_no,:customer_id,:total_amount,:paid_amount,:payment_method,:remark,:user_id,:create_by) ";
    var [data] = await db.query(sqlOrder, order);

    order_details.map(async (item, index) => {
      // order product
      var sqlOrderDetails =
        "INSERT INTO order_detail (order_id,proudct_id,qty,price,discount,total) VALUES (:order_id,:proudct_id,:qty,:price,:discount,:total) ";
      var [dataOrderProduct] = await db.query(sqlOrderDetails, {
        ...item,
        order_id: data.insertId, // overrid key order_id
      });

      // re stock
      var sqlReStock =
        "UPDATE product SET qty = (qty-:order_qty) WHERE id = :proudct_id ";
      var [dataRestock] = await db.query(sqlReStock, {
        order_qty: item.qty,
        proudct_id: item.proudct_id,
      });
    });
    const [currentOrder] = await db.query(
      "SELECT * FROM `order` WHERE id=:id",
      {
        id: data.insertId,
      }
    );
    res.json({
      order: currentOrder.length > 0 ? currentOrder[0] : null,
      order_details: order_details,
      message: "Insert success!",
    });
  } catch (error) {
    logError("order.create", error, res);
  }
};

const newOrderNo = async (req, res) => {
  try {
    var sql =
      "SELECT " +
      "CONCAT('INV-',LPAD((SELECT COALESCE(MAX(id),0) + 1 FROM `order`), 5, '0')) " +
      "as order_no";
    var [data] = await db.query(sql);
    return data[0].order_no;
  } catch (error) {
    logError("newOrderNo.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE  order set name=:name, code=:code, tel=:tel, email=:email, address=:address, website=:website, note=:note WHERE id=:id ";
    var [data] = await db.query(sql, {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Update success!",
    });
  } catch (error) {
    logError("order.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM order WHERE id = :id", {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("order.remove", error, res);
  }
};
