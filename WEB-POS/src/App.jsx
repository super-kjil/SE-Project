import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../src/AdminPage/page/home/HomePage";
import MainLayout from "../src/component/layout/MainLayout";
import MainLayoutAuth from "../src/component/layout/MainLayoutAuth";
import EmployeePage from "../src/AdminPage/page/employee/EmployeePage";
import CustomerPage from "../src/AdminPage/page/customer/CustomerPage";
import CategoryPage from "../src/AdminPage/page/category/CategoryPage";
import UserPage from "../src/AdminPage/page/user/UserPage";
import RolePage from "../src/AdminPage/page/role/RolePage";
import SupplierPage from "../src/AdminPage/page/purchase/SupplierPage";
import ProductPage from "../src/AdminPage/page/product/ProductPage";
import ExpenseTypePage from "../src/AdminPage/page/expense/ExpenseTypePage";
import ExpensePage from "../src/AdminPage/page/expense/ExpensePage";
import MainLayoutClient from "../src/component/layout/MainLayoutClient";
import PosPage from "../src/AdminPage/page/pos/PosPage";
import OrderPage from "../src/AdminPage/page/order/OrderPage";
import SettingPage from "../src/AdminPage/page/setting/SettingPage";
import HomePageClient from "./ClientPage/HomePageClient";
import MainLayoutKitchen from "./component/layout/MainLayoutKitchen";
import SignUpPage from "./AdminPage/page/auth/SignUpPage";
import SignInPage from "./AdminPage/page/auth/SignInPage";
import RegisterPage from "./AdminPage/page/auth/RegisterPage";
import LoginPage from "./AdminPage/page/auth/LoginPage";
import ProfileSetting from "./ClientPage/ProfileSetting";
import HomePageKitchen from "./KitchenPage/HomePageKitchen";

function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route element={<MainLayoutClient />}></Route>
        <Route element={<MainLayoutKitchen />}></Route>
        <Route path="/home" element={<HomePageClient />} />
        <Route path="/kitchen" element={<HomePageKitchen />} />
        <Route path="/profile_setting" element={<ProfileSetting />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<HomePage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/role" element={<RolePage />} />
          <Route path="/setting" element={<SettingPage />} />
          <Route path="/supplier" element={<SupplierPage />} />
          <Route path="/expense_type" element={<ExpenseTypePage />} />
          <Route path="/expense" element={<ExpensePage />} />
          <Route path="*" element={<h1>404-Route Not Found!</h1>} />
        </Route>

        <Route element={<MainLayoutAuth />}>
          <Route path="/signIn" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
