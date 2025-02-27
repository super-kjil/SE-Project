const { db, isArray, isEmpty, logError } = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [category] = await db.query(
      "select id as value, name as label,description from category"
    );
    const [role] = await db.query("select id,name,code from role");
    const [expense_type] = await db.query("SELECT * FROM expense_type");
    const [supplier] = await db.query("select id,name,code from supplier");
    const [customer] = await db.query(
      "select id as value, concat(name,'-',tel) as label, name, tel, username from customer"
    );
    const purchase_status = [
      {
        lebel: "Pending",
        value: "Pending",
      },
      {
        lebel: "Approved",
        value: "Approved",
      },
      {
        lebel: "Shiped",
        value: "Shiped",
      },
      {
        lebel: "Received",
        value: "Received",
      },
      {
        lebel: "Issues",
        value: "Issues",
      },
    ];
    const brand = [
      { label: "Apple", value: "Apple", country: "USA" },
      { label: "Samsung", value: "Samsung", country: "South Korea" },
      { label: "Dell", value: "Dell", country: "USA" },
      { label: "HP", value: "HP", country: "USA" },
      { label: "Lenovo", value: "Lenovo", country: "China" },
      { label: "Asus", value: "Asus", country: "Taiwan" },
      { label: "Acer", value: "Acer", country: "Taiwan" },
      { label: "Microsoft", value: "Microsoft", country: "USA" },
    ];

    res.json({
      category,
      role,
      supplier,
      purchase_status,
      brand,
      expense_type,
      customer,
    });
  } catch (error) {
    logError("config.getList", error, res);
  }
};
