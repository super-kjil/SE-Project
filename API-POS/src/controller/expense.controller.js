const { db, isArray, isEmpty, logError } = require("../util/helper");


exports.getListEpenseType = async (req, res) => {
  try {
    var txtSearch = req.query.txtSearch;
    var sql = "SELECT * FROM expense_type ";
    const [list] = await db.query(sql);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("expense_type.getListEpenseType", error, res);
  }
};

exports.getList = async (req, res) => {
  try {
    var txtSearch = req.query.txtSearch;
    let sql =
    " SELECT " +
    " e.id, " +
    " e.name, " +
    " e.ref_no, " +
    " e.amount, " +
    " e.remark, " +
    " e.create_by, " +
    " e.create_at, " +
    " et.name AS expense_type, " +
    " e.expense_type_id " +
    " FROM expense e " +
    " INNER JOIN expense_type et ON e.expense_type_id = et.id ";

    if (!isEmpty(txtSearch)) {
      sql +=
        " WHERE ref_no  LIKE :txtSearch";
    }
    const [list] = await db.query(sql, {
      txtSearch: "%" + txtSearch + "%",
    });
    res.json({
      list: list,
    });
  } catch (error) {
    logError("expense.getList", error, res);
  }
};

//id ref_no name amount remark expense_date create_by create_at

exports.create = async (req, res) => {
  try {
    var sql =
      "INSERT INTO expense (name,ref_no,amount,expense_date,create_by) VALUES (:name,:ref_no,:amount,:expense_date,:create_by) ";
    var [data] = await db.query(sql, {
      ...req.body,
      create_by: req.auth?.name,
    });
    res.json({
      data: data,
      message: "Insert success!",
    });
  } catch (error) {
    logError("expense.create", error, res);
  }
};

exports.update = async (req, res) => {
  try {
    var sql =
      "UPDATE  expense SET name=:name, tel=:tel, email=:email, address=:address, type=:type WHERE id=:id ";
    var [data] = await db.query(sql, {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Update success!",
    });
  } catch (error) {
    logError("expense.update", error, res);
  }
};

exports.remove = async (req, res) => {
  try {
    var [data] = await db.query("DELETE FROM expense WHERE id = :id", {
      ...req.body,
    });
    res.json({
      data: data,
      message: "Data delete success!",
    });
  } catch (error) {
    logError("expense.remove", error, res);
  }
};
