import React, { useEffect, useState } from "react";
import { ConfigProvider, Dropdown, Layout, Menu, Switch, theme } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/Arrow.png";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import {
  getProfile,
  setAcccessToken,
  setProfile,
  getPermission,
} from "../../store/profile.store";
import { request } from "../../util/helper";
import { configStore } from "../../store/configStore";
import { Config } from "../../util/config";
import { FaUser, FaUserTag } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { AiFillDashboard, AiFillProduct } from "react-icons/ai";
import { FaCartShopping, FaFileInvoiceDollar } from "react-icons/fa6";
import { HiUserGroup } from "react-icons/hi";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { TbCoinFilled } from "react-icons/tb";
import { RiSettings3Fill } from "react-icons/ri";

const { Content, Sider } = Layout;

const items_menu = [
  {
    key: "dashboard",
    label: "Dashabord",
    icon: <AiFillDashboard />,
  },
  {
    key: "pos",
    label: "POS",
    icon: <FaFileInvoiceDollar />,
  },
  {
    key: "customer",
    label: "Customer",
    icon: <HiUserGroup />,
  },
  {
    key: "order",
    label: "Order",
    children: null,
    icon: <FaCartShopping />,
  },
  {
    key: "product",
    label: "Product",
    icon: <AiFillProduct />,
    children: [
      {
        key: "product",
        label: "List Porduct",
        children: null,
      },
      {
        key: "category",
        label: "Category",
        children: null,
      },
    ],
  },
  {
    key: "purchase",
    label: "Purchase",
    icon: <BiSolidPurchaseTag />,
    children: [
      {
        key: "supplier",
        label: "Supplier",
        children: null,
      },
      {
        key: "purchase",
        label: "List purchase",
        children: null,
      },
      {
        key: "purchase_product",
        label: "Purchase Product",
        children: null,
      },
    ],
  },
  {
    key: "expense",
    label: "Expense",
    icon: <TbCoinFilled />,
    children: [
      {
        key: "expense_type",
        label: "Expense Type",
        children: null,
      },
      {
        key: "expense",
        label: "Expense",
        children: null,
      },
    ],
  },
  {
    key: "employee",
    label: "Employee",
    icon: <FaUserTag />,
    children: [
      {
        key: "employee",
        label: "Employee",
        children: null,
      },
      {
        key: "payroll",
        label: "Payroll",
        children: null,
      },
    ],
  },

  {
    key: "user",
    label: "User",
    icon: <FaUser />,
    children: [
      {
        key: "user",
        label: "User",
        children: null,
      },
      {
        key: "role",
        label: "Role",
        children: null,
      },
      {
        key: "role_permission",
        label: "Role Permmission",
        children: null,
      },
    ],
  },

  {
    key: "setting",
    label: "Setting",
    icon: <RiSettings3Fill />,
    children: [
      {
        key: "setting",
        label: "Currency",
        children: null,
      },
      {
        key: "langauge",
        label: "Langauge",
        children: null,
      },
    ],
  },
];

const MainLayout = () => {
  const permission = getPermission();
  const location = useLocation();
  const { setConfig } = configStore();
  const navigate = useNavigate();
  const profile = getProfile();
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // alert(location.pathname)
    checkIsNotPermissionViewPage();
    getMenuByUser();
    getConfig();
    if (!profile) {
      navigate("/signIn");
    }
  }, []);

  const checkIsNotPermissionViewPage = async () => {
    let findIndex = permission?.findIndex(
      (item) => item.web_route_key == location.pathname
    );
    if (findIndex == -1) {
      for (let i = 0; i < permission.length; i++) {
        if (permission[i].web_route_key != "") {
          navigate(permission[i].web_route_key);
          break;
        }
      }
    }
  };

  const getMenuByUser = async () => {
    let new_item_menu = [];
    items_menu.map((item1) => {
      //Access Level 1
      const p1 = permission?.findIndex(
        (data1) => data1.web_route_key == "/" + item1.key
      );
      if (p1 != -1) {
        new_item_menu.push(item1);
      }
      //// Access Level 2
      // if (item1?.children && item1?.children.length > 0) {
      //   let childTmp =[];
      //   item1?.children.map((data1) => {
      //     permission?.map((data2) => {
      //       if (data2.web_route_key == "/" + data1.key) {
      //         childTmp.push(data1);
      //       }
      //     });
      //   });
      //   if (childTmp.length > 0 ) {
      //     item1.children = childTmp;
      //     new_item_menu.push(item1)
      //   }
      // }
    });
    setItems(new_item_menu);
  };

  const getConfig = async () => {
    const res = await request("config", "get");
    if (res) {
      setConfig(res);
    }
  };

  const onClickMenu = (item) => {
    navigate(item.key);
  };

  const onLoginOut = () => {
    setProfile("");
    setAcccessToken("");
    navigate("/signIn");
  };

  if (!profile) {
    return null;
  }

  const itemsDropdown = [
    {
      key: "profile",
      // danger:false,
      label: "Profile",
      icon: <FaUser />,
    },
    {
      key: "logout",
      danger: true,
      label: "Logout",
      icon: <IoLogOut />,
    },
  ];

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleTheme = (checked) => {
    setIsDarkTheme(checked);
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: "gray",
            siderBg: "#3d3d3d",
          },
          Menu: {
            darkItemColor: "#ffffff",
            darkItemBg: "#3d3d3d",
            darkSubMenuItemBg: "#262626",
            darkItemSelectedColor: "#ffffff",
            darkItemSelectedBg: "#52c41a",
            darkSubMenuSelectedBg: "#52c41a",
            darkItemHoverBg: "#faad14",
            darkSubMenuHoverBg: "#faad14",
            itemColor: "#000000",
            itemBg: "#ffffff",
            lightSubMenuItemBg: "#faad14",
            itemSelectedColor: "#00000",
            itemSelectedBg: "#ffffff",
          },
          Content: {},
        },
      }}
    >
      {/* Main Layout */}
      <Layout className="h-screen ">
        <Sider
          collapsible
          className=" xs:ml-0 mr-3 rounded-0 xs:min-w-7"
          theme={isDarkTheme ? "dark" : "light"}
          collapsedWidth="55"
          breakpoint="lg"
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          {/* Full height container with vertical alignment */}
          <div className="flex flex-col h-screen">
            {/* Sider Header */}
            <Menu className="my-3" theme={isDarkTheme ? "dark" : "light"}>
              <div className="flex flex-col items-center">
                <p className="text-xl font-bold xs:text-xs">POS</p>
                <p className="text-xs  hidden-992">Computer & Phone Shop</p>
              </div>
            </Menu>
            {/* Sider Header */}

            {/* Menu at the top */}
            <Menu
              theme={isDarkTheme ? "dark" : "light"}
              mode="inline"
              items={items}
              onClick={onClickMenu}
            />

            {/* Switch at the bottom */}
            <div className="mt-auto flex justify-center items-center p-3 mb-8 ">
              <Switch
                checked={isDarkTheme}
                onChange={toggleTheme}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
            </div>
          </div>
        </Sider>

        <Layout>
          {/* Top header menu */}
          <Menu
            theme={isDarkTheme ? "dark" : "light"}
            className=" 2xl:h-20 xl:h-20 xl:mt-2 xs:h-12 xs:mt-0 xxs:h-12 xxs:mt-0 flex justify-between items-center p-3 rounded-xl m-2 ml-0"
          >
            {/* Left Side */}
            <div className="flex items-center">
              <img
                className="xl:w-14 rounded-full mr-3 xs:w-7 xxs:w-7"
                src={Logo}
                alt="Logo"
              />
              <div className="flex flex-col">
                <p className="text-xs font-bold">POS</p>
                <p className="text-xs hidden-992">Computer & Phone Shop</p>
              </div>
            </div>
            {/* Left Side */}

            {/* Middle Item */}
            <div className="flex items-center gap-5">
              <ConfigProvider
                theme={{
                  inherit: false,
                }}
              ></ConfigProvider>
            </div>
            {/* Middle Item */}

            {/* Right Side */}
            <div className="flex items-center ml-auto gap-3">
              <IoIosNotifications className="text-3xl hidden-992" />
              <MdOutlineMarkEmailUnread className="text-3xl hidden-992" />
              <div className="text-right">
                <div className="text-xs font-bold hidden-992">
                  {profile?.name}
                </div>
                <div className="text-xs hidden-992">{profile?.role_name}</div>
              </div>
              <Dropdown
                overlay={
                  <Menu
                    items={itemsDropdown}
                    onClick={(e) => {
                      if (e.key === "logout") {
                        onLoginOut();
                      }
                    }}
                  />
                }
              >
                <img
                  className="xl:w-14 h-1/2 rounded-full cursor-pointer xs:w-7 xxs:w-7"
                  src={Config.image_path + profile.image}
                  alt="User"
                />
              </Dropdown>
            </div>
            {/* Right Side */}
          </Menu>
          {/* Layout Contet    */}
          <Content class="space-y-4 rounded-lg overflow-y-scroll scrollbar h-full">
            <div className="border-t border-black pt-2 h-full ">
              <Outlet />
            </div>
          </Content>
          {/* Layout Contet    */}
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default MainLayout;
