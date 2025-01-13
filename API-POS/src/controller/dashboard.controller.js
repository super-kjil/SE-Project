// const { timelineItem } = require("@material-tailwind/react");
// const {
//   db,
//   isArray,
//   isEmpty,
//   logError,
//   removeFile,
// } = require("../util/helper");

// exports.getList = async (req, res) => {
//   try {
//     const [customer] = await db.query("SELECT COUNT(id) total FROM customer");
//     const [employee] = await db.query("SELECT COUNT(id) total FROM employee");
//     const [expense] = await db.query(
//       "SELECT CONCAT('$ ',SUM(amount)) total, COUNT(id) total_amount FROM expense r WHERE MONTH(expense_date)= MONTH(CURRENT_DATE) AND YEAR(expense_date) = YEAR(CURRENT_DATE)"
//     );
//     const [sale] = await db.query(
//       "SELECT CONCAT('$ ',SUM(r.paid_amount)) total, COUNT(r.id) total_order FROM `order` r WHERE MONTH(r.create_at)= MONTH(CURRENT_DATE) AND YEAR(r.create_at) = YEAR(CURRENT_DATE)"
//     );

//     const [sale_summary_by_month] = await db.query(
//       "SELECT DATE_FORMAT(r.create_at, '%M') AS title, SUM(r.total_amount) AS total FROM `order` r WHERE YEAR(r.create_at) = YEAR(CURRENT_DATE) GROUP BY DATE_FORMAT(r.create_at, '%M')"
//     );
//     const [expense_summary_by_month] = await db.query(
//       "SELECT DATE_FORMAT(expense_date, '%M') AS month, SUM(amount) AS total, COUNT(id) AS total_order FROM expense WHERE YEAR(expense_date) = YEAR(CURRENT_DATE) GROUP BY MONTH(expense_date), DATE_FORMAT(expense_date, '%M') ORDER BY MONTH(expense_date)"
//     );
//     let dashboard = [
//       {
//         title: "Customer",
//         // total: customer[0].total,
//         summary: {
//           Total: customer[0].total,
//           Male: 1,
//           Female: 2,
//         },
//       },
//       {
//         title: "Employee",
//         total: employee[0].total,
//       },
//       {
//         title: "Sale",
//         summary: {
//           Sale: "This Month",
//           Total: sale[0].total,
//           // Total_Order:sale[0].total_order,
//           ["Total_Order".replace(/_/g, " ")]: sale[0].total_order, // Inline replacement
//         },
//       },
//       {
//         title: "Expense",
//         summary: {
//           Total: expense[0].total,
//           ["Total_Expense".replace(/_/g, " ")]: expense[0].total_amount, // Inline replacement
//         },
//       },
//     ];
//     res.json({
//       dashboard,
//       sale_summary_by_month,
//       expense_summary_by_month,
//     });
//   } catch (error) {
//     logError("dashboard.getList", error, res);
//   }
// };
const { timelineItem } = require("@material-tailwind/react");
const {
  db,
  isArray,
  isEmpty,
  logError,
  removeFile,
} = require("../util/helper");

exports.getList = async (req, res) => {
  try {
    const [customer] = await db.query("SELECT COUNT(id) total FROM customer");
    const [employee] = await db.query("SELECT COUNT(id) total FROM employee");
    const [expense] = await db.query(
      "SELECT CONCAT('$ ',SUM(amount)) total, COUNT(id) total_amount FROM expense r WHERE MONTH(expense_date)= MONTH(CURRENT_DATE) AND YEAR(expense_date) = YEAR(CURRENT_DATE)"
    );
    const [sale] = await db.query(
      "SELECT CONCAT('$ ',SUM(r.paid_amount)) total, COUNT(r.id) total_order FROM `order` r WHERE MONTH(r.create_at)= MONTH(CURRENT_DATE) AND YEAR(r.create_at) = YEAR(CURRENT_DATE)"
    );

    const [sale_summary_by_month] = await db.query(
      "SELECT DATE_FORMAT(r.create_at, '%M') AS title, SUM(r.total_amount) AS total FROM `order` r WHERE YEAR(r.create_at) = YEAR(CURRENT_DATE) GROUP BY DATE_FORMAT(r.create_at, '%M')"
    );
    const [expense_summary_by_month] = await db.query(
      "SELECT DATE_FORMAT(expense_date, '%M') AS month, SUM(amount) AS total, COUNT(id) AS total_order FROM expense WHERE YEAR(expense_date) = YEAR(CURRENT_DATE) GROUP BY MONTH(expense_date), DATE_FORMAT(expense_date, '%M') ORDER BY MONTH(expense_date)"
    );

    const [sales_expense_combined] = await db.query(
      `SELECT 
          DATE_FORMAT(r.create_at, '%Y-%m') AS YearMonth,
          SUM(e.amount) AS TotalExpense,
          SUM(r.total_amount) AS TotalSale
       FROM 
          \`order\` r
       LEFT JOIN 
          expense e 
          ON YEAR(r.create_at) = YEAR(e.expense_date) 
          AND MONTH(r.create_at) = MONTH(e.expense_date)
       WHERE 
          YEAR(r.create_at) = YEAR(CURRENT_DATE)
       GROUP BY 
          DATE_FORMAT(r.create_at, '%Y-%m')
       ORDER BY 
          YearMonth;`
    );

    let dashboard = [
      {
        title: "Customer",
        summary: {
          Total: customer[0].total,
          Male: 1,
          Female: 2,
        },
      },
      {
        title: "Employee",
        summary: {
          Total: employee[0].total,
          Male: 1,
          Femal: 2,
        },
      },
      {
        title: "Sale",
        summary: {
          Sale: "This Month",
          Total: sale[0].total,
          ["Total_Order".replace(/_/g, " ")]: sale[0].total_order,
        },
      },
      {
        title: "Expense",
        summary: {
          Expense: "This Month",
          Total: expense[0].total,
          ["Total_Expense".replace(/_/g, " ")]: expense[0].total_amount,
        },
      },
    ];

    res.json({
      dashboard,
      sale_summary_by_month,
      expense_summary_by_month,
      sales_expense_combined,
    });
  } catch (error) {
    logError("dashboard.getList", error, res);
  }
};
