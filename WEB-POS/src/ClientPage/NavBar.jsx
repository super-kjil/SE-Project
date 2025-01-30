import { Badge, Dropdown, Input, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import Logo from "../assets/image/logo/cafelogo.jpg";
import User from "../assets/image/logo/image-profile.jpg";
import { useHomeCartStore } from "../store/configStore";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
function NavBar() {
  const {
    cart,
    loadCart,
    addToCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useHomeCartStore();
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    visibleModal: false,
    visibleModalAdd: false,
  });

  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });
  const getList = async () => {
    const param = {
      ...filter,
      page: 1,
      is_list_all: 1,
    };
    setState((pre) => ({ ...pre, loading: true }));
    const res = await request("product", "get", param);
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        total: res.total,
        loading: false,
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
    }
  };
  useEffect(() => {
    loadCart();
    getList();
  }, [filter]);

  const itemsDropdown = [
    {
      key: "profile",
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
  return (
    <Menu className="bg-slate-500 sticky top-0 flex justify-between items-center p-3 z-50 shadow-md">
      {/* Left Side */}
      <div className="flex items-center">
        <img
          className="xl:w-14 rounded-full mr-3 xs:w-7 xxs:w-7"
          src={Logo}
          alt="Logo"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold">Kjil JM</p>
          <p className="text-sm hidden-992">Coffee Shop</p>
        </div>
      </div>
      <div>
        <Input
          onChange={(event) =>
            setFilter((p) => ({ ...p, txt_search: event.target.value }))
          }
          allowClear
          placeholder="Search"
        />
      </div>
      {/* Left Side */}
      {/* Right Side */}
      <div className="flex items-center ml-auto gap-3">
        {cart.length > 0 ? (
          <button onClick={handleOpenModal}>
            {/* Existed item in cart */}
            <Badge count={cart.length}>
              <FaCartShopping className="size-7 " />
            </Badge>
          </button>
        ) : (
          //Blank item in cart
          <Badge count={cart.length}>
            <FaCartShopping className="size-7 text-slate-500" />
          </Badge>
        )}
        <div className="flex justify-center items-center">
          {cart.length > 0 ? (
            <button onClick={handleOpenModal}>
              {/* Existed item in cart */}
              <Badge count={cart.length}>
                <FiHeart className="size-7 " />
              </Badge>
            </button>
          ) : (
            //Blank item in cart
            <Badge count={cart.length}>
              <FiHeart className="size-7 text-slate-500" />
            </Badge>
          )}
        </div>
        {/* <Dropdown
                overlay={
                  <Menu
                    items={itemsDropdown}
                    onClick={(event) => {
                      if (event.key === "logout") {
                        onLoginOut();
                      }
                    }}
                  />
                }
              > */}
        <Dropdown
          menu={{
            items: itemsDropdown,
            onClick: (event) => {
              if (event.key == "logout") {
                onLoginOut();
              } else if (event.key == "profile") {
                // handleOpenProfileModal();
                showDrawer();
              }
            },
          }}
        >
          <img
            className="xl:w-14 h-1/2 rounded-full cursor-pointer xs:w-7 xxs:w-7"
            // src={
            //   customerProfile.image
            //     ? Config.image_path + customerProfile.image
            //     : { User }
            // }
            src={User}
            alt="User"
          />
        </Dropdown>
      </div>
      {/* Right Side */}
    </Menu>
  );
}

export default NavBar;
