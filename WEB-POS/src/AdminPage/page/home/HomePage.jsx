import { useEffect, useState } from "react";
import { request } from "../../../util/helper";
import HomeGrid from "../../../component/home/HomeGrid";
import HomeSaleChart from "../../../component/home/HomeSaleChart";
import { Button, Col, Row } from "antd";
import HomeExpenseByMonthChart from "../../../component/home/HomeExpenseByMonthChart";
import MainPage from "../../../component/layout/MainPage";
import HomeSaleAndExpendChart from "../../../component/home/HomeSaleAndExpendChart";

function HomePage() {
  const [dashboard, setDashboard] = useState([]);
  const [saleByMonth, setSaleByMonth] = useState([]);
  const [expenseByMonth, setExpenseByMonth] = useState([]);
  const [salesExpenseCombined, setSalesExpenseCombined] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("dashboard", "get");
    if (res && !res.error) {
      setDashboard(res.dashboard);

      if (res.sale_summary_by_month) {
        let dataTmp = [["Month", "Sales"]];
        res.sale_summary_by_month.forEach((item) => {
          dataTmp.push([String(item.title), Number(item.total) || 0]);
        });
        setSaleByMonth(dataTmp);
      }

      if (res.expense_summary_by_month) {
        let dataTmp = [["Month", "Expense"]];
        res.expense_summary_by_month.forEach((item) => {
          dataTmp.push([String(item.month), Number(item.total) || 0]);
        });
        setExpenseByMonth(dataTmp);
      }

      if (res.sales_expense_combined) {
        let dataTmp = [["YearMonth", "Sales", "Expenses"]];
        res.sales_expense_combined.forEach((item) => {
          dataTmp.push([
            String(item.YearMonth),
            parseFloat(item.TotalSale) || 0,
            parseFloat(item.TotalExpense) || 0,
          ]);
        });
        setSalesExpenseCombined(dataTmp);
      }
    }
  };

  return (
    <MainPage loading={false}>
      <div>
        {/* <HomeGrid data={dashboard} /> */}
        <Row>
          <Col span={12}>
            <HomeSaleChart data={saleByMonth} />
          </Col>
          <Col span={12}>
            <HomeExpenseByMonthChart data={expenseByMonth} />
          </Col>
        </Row>
        <HomeSaleAndExpendChart data={salesExpenseCombined} />
      </div>
    </MainPage>
  );
}

export default HomePage;

// import { useEffect, useState } from "react";
// import { request } from "../../../util/helper";
// import HomeGrid from "../../../component/home/HomeGrid";
// import HomeSaleChart from "../../../component/home/HomeSaleChart";
// import { Button, Col, Row } from "antd";
// import HomeExpenseByMonthChart from "../../../component/home/HomeExpenseByMonthChart";
// import MainPage from "../../../component/layout/MainPage";
// import HomeSaleAndExpendChart from "../../../component/home/HomeSaleAndExpendChart";

// function HomePage() {
//   const [dashboard, setDashboard] = useState([]);
//   const [saleByMonth, setSaleByMonth] = useState([]);
//   const [expenseByMonth, setExpenseByMonth] = useState([]);
//   const [salesExpenseCombined, setSalesExpenseCombined] = useState([]);

//   useEffect(() => {
//     getList();
//   }, []);

//   const getList = async () => {
//     const res = await request("dashboard", "get");
//     if (res && !res.error) {
//       setDashboard(res.dashboard);

//       if (res.sale_summary_by_month) {
//         let dataTmp = [["Month", "Sales"]];
//         res.sale_summary_by_month.forEach((item) => {
//           dataTmp.push([item.title, Number(item.total) || 0]);
//         });
//         setSaleByMonth(dataTmp);
//       }

//       if (res.expense_summary_by_month) {
//         let dataTmp = [["Month", "Expense"]];
//         res.expense_summary_by_month.forEach((item) => {
//           dataTmp.push([item.month, Number(item.total) || 0]);
//         });
//         setExpenseByMonth(dataTmp);
//       }

//       if (res.sales_expense_combined) {
//         let dataTmp = [["YearMonth", "Sales", "Expenses"]];
//         res.sales_expense_combined.forEach((item) => {
//           dataTmp.push([
//             item.YearMonth,
//             parseFloat(item.TotalSale) || 0,
//             parseFloat(item.TotalExpense) || 0,
//           ]);
//         });
//         setSalesExpenseCombined(dataTmp);
//       }
//     }
//   };

//   return (
//     <MainPage loading={false}>
//       <div>
//         <HomeGrid data={dashboard} />
//         <Row>
//           <Col span={12}>
//             <HomeSaleChart data={saleByMonth} />
//           </Col>
//           <Col span={12}>
//             <HomeExpenseByMonthChart data={expenseByMonth} />
//           </Col>
//         </Row>
//         <HomeSaleAndExpendChart data={salesExpenseCombined} />
//       </div>
//     </MainPage>
//   );
// }

// export default HomePage;
