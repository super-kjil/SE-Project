import { Outlet, useNavigate } from "react-router-dom";
import { request } from "../../util/helper";
import React, { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  Badge,
  Button,
  Col,
  ConfigProvider,
  Empty,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Menu,
  Dropdown,
  Form,
  Drawer,
  Upload,
} from "antd";
import { FaCartShopping, FaRegHeart, FaUser } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import Logo from "../../assets/Arrow.png";
import User from "../../assets/avatar.png";
import MainPage from "../../component/layout/MainPage";
import { Content } from "antd/es/layout/layout";
import {
  configStore,
  useHomeCartStore,
  useCartStore,
} from "../../store/configStore";
import AddedTocart from "../clientPage/AddedTocart";
import {
  getCustomerProfile,
  setAcccessToken,
  setCustomerProfile,
  // getPermission,
} from "../../store/profile.store";
import { Config } from "../../util/config";

function MainLayoutClient() {
  const [form] = Form.useForm();

  const {
    cart,
    loadCart,
    addToCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useHomeCartStore();
  const customerProfile = getCustomerProfile();
  const { config, setConfig } = configStore();
  const navigate = useNavigate();
  const [objSummary, setObjSummary] = useState({
    sub_total: 0,
    total_qty: 0,
    save_discount: 0,
    tax: 10,
    total: 0,
    total_paid: 0,
    customer_id: null,
    payment_method: null,
    remark: null,
    order_no: null, // set after order
    order_date: null, // set after order
  });
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    visibleModal: false,
    visibleModalProfile: false,
  });

  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  const getConfig = async () => {
    const res = await request("config", "get");
    if (res) {
      setConfig(res);
    }
  };

  useEffect(() => {
    // alert(location.pathname)
    // checkIsNotPermissionViewPage();
    // getMenuByUser();
    getConfig();
    if (!customerProfile) {
      navigate("/login");
    }
  }, []);

  if (!customerProfile) {
    return null;
  }
  useEffect(() => {
    handleCalSummary();
  }, [cart]);

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

  const handleIncrease = (item) => {
    increaseQuantity(item.barcode);
  };

  const handleDescrease = (item) => {
    if (item.cart_qty > 1) {
      decreaseQuantity(item.barcode);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.barcode);
  };

  const handleClearCart = () => {
    Modal.confirm({
      title: "Remove Items",
      content: "Are you sure you want to remove all products from the cart?",
      onOk: async () => {
        clearCart();
        // removeFromCart();
      },
    });
  };

  const handleCalSummary = useCallback(() => {
    let total_qty = 0,
      sub_total = 0,
      save_discount = 0,
      total = 0,
      original_total = 0;

    cart.map((item) => {
      total_qty += item.cart_qty; // done
      var final_price = item.price;
      if (item.discount != 0 && item.discount != null) {
        final_price = item.price - (item.price * item.discount) / 100;
        final_price = final_price.toFixed(2);
      }
      original_total += item.cart_qty * item.price;
      sub_total += item.cart_qty * final_price;
    });
    total = sub_total;
    save_discount = original_total - sub_total;
    setObjSummary((p) => ({
      ...p,
      total_qty: total_qty,
      sub_total: sub_total.toFixed(2),
      save_discount: save_discount.toFixed(2),
      total: total.toFixed(2),
    }));
  }, [cart]);

  const handleClickOut = async () => {
    var order_details = [];
    cart.forEach((item) => {
      var total = Number(item.cart_qty) * Number(item.price);
      if (item.discount != null && item.discount != 0) {
        total = total - (total * Number(item.discount)) / 100;
      }
      var objItem = {
        proudct_id: item.id,
        qty: Number(item.cart_qty),
        price: Number(item.price),
        discount: Number(item.discount),
        total: total,
      };
      order_details.push(objItem);
    });
    var param = {
      order: {
        customer_id: objSummary.customer_id,
        total_amount: objSummary.total,
        paid_amount: objSummary.total_paid,
        payment_method: objSummary.payment_method,
        remark: objSummary.remark,
      },
      order_details: order_details,
    };
    const res = await request("order", "post", param);
    if (res && !res.error) {
      if (res.order) {
        message.success("Order created success!");
        setObjSummary((p) => ({
          ...p,
          order_no: res.order?.order_no,
          order_date: res.order?.create_at,
        }));
        setTimeout(() => {
          handlePrintInvoice(); // open print dialog
        }, 2000);
      }
    } else {
      message.success("Order not complete!");
    }
  };
  const handleOpenModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: true,
    }));
  };
  const onCloseModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: false,
    }));
  };
  const onCloseModalProfile = () => {
    setState((p) => ({
      ...p,
      visibleModalProfile: false,
    }));
  };
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
  // const handleOrder = async () => {
  //   var order_details = [];
  //   cart.forEach((item) => {
  //     var total = Number(item.cart_qty) * Number(item.price);
  //     if (item.discount != null && item.discount != 0) {
  //       total = total - (total * Number(item.discount)) / 100;
  //     }
  //     var objItem = {
  //       product_id: item.id,
  //       qty: Number(item.cart_qty),
  //       price: Number(item.price),
  //       discount: Number(item.discount),
  //       total: total,
  //     };
  //     order_details.push(objItem);
  //   });

  //   var param = {
  //     order: {
  //       // customer_id: objSummary.customer_id,
  //       total_amount: objSummary.total,
  //       paid_amount: objSummary.total,
  //       // payment_method: objSummary.payment_method,
  //       // remark: objSummary.remark,
  //     },
  //     order_details: order_details,
  //   };

  //   const res = await request("order", "post", param);
  //   if (res && !res.error) {
  //     if (res.order) {
  //       message.success("Order created successfully!");
  //       // Update global state with the order details
  //       useCartStore.getState().setLastOrder(order_details); // Update lastOrder in the store
  //       clearCart(); // Clear the cart after placing the order
  //     }
  //   } else {
  //     message.error("Order not complete!");
  //   }
  // };

  // const handleOrder = async () => {
  //   const orderDetails = cart.map((item) => ({
  //     product_id: item.id,
  //     qty: item.cart_qty,
  //     price: item.price,
  //     discount: item.discount,
  //   }));

  //   const param = {
  //     order: {
  //       total_amount: cart.reduce(
  //         (sum, item) => sum + item.cart_qty * item.price,
  //         0
  //       ),
  //     },
  //     order_details: orderDetails,
  //   };

  //   const res = await request("order", "post", param);
  //   if (res && !res.error) {
  //     message.success("Order created successfully!");
  //     socket.emit("placeOrder", orderDetails);
  //     setCart([]);
  //   }
  //   // else {
  //   //   message.error("Order not complete!");
  //   // }
  // };

  const handleOrder = async () => {
    const orderDetails = cart.map((item) => ({
      product_id: item.id,
      qty: item.cart_qty,
      price: item.price,
      discount: item.discount,
      total: item.cart_qty * item.price,
    }));

    const param = {
      order: {
        customer_id: 1, // Example value, replace with actual customer ID
        total_amount: cart.reduce(
          (sum, item) => sum + item.cart_qty * item.price,
          0
        ),
        paid_amount: cart.reduce(
          (sum, item) => sum + item.cart_qty * item.price,
          0
        ), // Set `paid_amount` equal to `total_amount` if no discounts apply
        payment_method: cart.reduce(
          (sum, item) => sum + item.cart_qty * item.price,
          "Cash"
        ),
      },
      order_details: orderDetails,
    };

    const res = await request("order", "post", param);
    if (res && !res.error) {
      message.success("Order created successfully!");
      socket.emit("placeOrder", orderDetails);
      setCart([]); // Clear the cart
    } else {
      message.error("Order not complete!");
    }
  };

  const onLoginOut = () => {
    setCustomerProfile("");
    setAcccessToken("");
    navigate("/login");
  };
  // Drawer component
  const [open, setOpen] = useState(false);
  const showDrawer = (item) => {
    setOpen(true);
    form.setFieldsValue({
      ...item,
    });
  };
  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };
  const onFinish = async (items) => {
    if (items.password !== items.confirm_password) {
      message.warning("Password and Confirm Password Not Match!");
      return;
    }
    var params = new FormData();
    params.append("name", items.name);
    params.append("role_id", items.role_id);
    params.append("username", items.username);
    params.append("password", items.password);
    params.append("is_active", items.is_active);
    // Append 'id' only if it exists (for editing)
    if (form.getFieldValue("id")) {
      params.append("id", form.getFieldValue("id"));
    }

    // Handle image upload logic
    if (items.image_default && items.image_default.file) {
      if (items.image_default.file.status === "removed") {
        params.append("image_remove", "1");
      } else {
        params.append(
          "upload_image",
          items.image_default.file.originFileObj,
          items.image_default.file.name
        );
      }
    }

    // Determine method: 'post' for new users, 'put' for updates
    var method = form.getFieldValue("id") ? "put" : "post";

    const res = await request("auth/register", method, params);
    if (res && !res.error) {
      message.success(res.message);
      handleCloseModal();
      getList();
    } else {
      message.error(res.message);
    }
  };
  // Upload User Image
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const [imageDefault, setImageDefault] = useState([]);
  const handleChangeImageDefault = ({ fileList: newFileList }) =>
    setImageDefault(newFileList);

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 10,
          colorBgMask: "rgba(0, 0, 0, .8)",
        },
      }}
    >
      <Drawer title="Profile Setting" onClose={onClose} open={open}>
        {/* <Form layout="vertical">
          <Form.Item
            label="Name"
            rules={[
              {
                required: true,
                message: "Please fill in name",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            rules={[
              {
                required: true,
                message: "Please fill in email address",
              },
            ]}
          >
            <Input placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            label="Password"
            rules={[
              {
                required: true,
                message: "Please fill in password",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please fill in confirm password",
              },
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item label="Address">
            <Input placeholder="Address" />
          </Form.Item>
        </Form>

        <div className="flex justify-between items-center my-8">
          <Button className=" w-2/5" onClick={onClose}>
            Cancel
          </Button>
          <Button type="primary" className=" w-2/5">
            Update
          </Button>
        </div>
        <Button
          className="w-full font-bold "
          type=""
          danger
          onClick={onLoginOut}
        >
          Logout
        </Button> */}
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name={"image_default"} label="Image">
            <Upload
              // className={"customSizedUpload"}
              customRequest={(options) => {
                options.onSuccess();
                // options.onProgress({ percent: 0 });
                // options.onProgress({ percent: 100 });
              }}
              // accept=""
              maxCount={1}
              // listType="picture-card"
              listType="picture-circle"
              fileList={imageDefault}
              onPreview={handlePreview}
              onChange={handleChangeImageDefault}
            >
              <div>+ Upload</div>
            </Upload>
          </Form.Item>
          <Form.Item
            name={"name"}
            label="Name"
            rules={[
              {
                required: true,
                message: "Please fill in name",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name={"username"}
            label="Email"
            rules={[
              {
                required: true,
                message: "Please fill in email",
              },
            ]}
          >
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item
            name={"password"}
            label="password"
            rules={[
              {
                required: true,
                message: "Please fill in password",
              },
            ]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Form.Item
            name={"confirm_password"}
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please fill in confirm password",
              },
            ]}
          >
            <Input.Password placeholder="confirm password" />
          </Form.Item>
          <Form.Item
            name={"role_id"}
            label="Role"
            rules={[
              {
                required: true,
                message: "Please select role",
              },
            ]}
          >
            <Select placeholder="Select Role" options={state.role} />
          </Form.Item>
          <Form.Item
            name={"is_active"}
            label="Status"
            rules={[
              {
                required: true,
                message: "Please select status",
              },
            ]}
          >
            <Select
              placeholder="Select Status"
              options={[
                {
                  label: "Active",
                  value: 1,
                },
                {
                  label: "InActive",
                  value: 0,
                },
              ]}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
      <Modal
        open={state.visibleModalProfile}
        title={"User Info"}
        // title={form.getFieldValue("id") ? "Edit Product" : "New Product"}
        footer={null}
        onCancel={onCloseModalProfile}
        // width={700}
      >
        <Form
          layout="vertical"
          // onFinish={onFinish} form={form}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name={"name"}
                label="Product name"
                rules={[
                  {
                    required: true,
                    message: "Please fill in product name",
                  },
                ]}
              >
                <Input placeholder="Product name" />
              </Form.Item>
              <Form.Item
                name={"brand"}
                label="Brand"
                rules={[
                  {
                    required: true,
                    message: "Please fill in product name",
                  },
                ]}
              >
                <Select
                  placeholder="Select brand"
                  options={config.brand?.map((item) => ({
                    label: item.label + " (" + item.country + ")",
                    value: item.value,
                  }))}
                />
              </Form.Item>

              <Form.Item name={"barcode"} label="Barcode">
                <Input
                  disabled
                  placeholder="Barcode"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item name={"qty"} label="Quantity">
                <InputNumber placeholder="Quantity" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name={"discount"} label="Discount">
                <InputNumber placeholder="Discount" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={"category_id"}
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please fill in product name",
                  },
                ]}
              >
                <Select
                  placeholder="Select category"
                  options={config.category}
                />
              </Form.Item>

              <Form.Item name={"price"} label="Price">
                <InputNumber placeholder="Price" style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name={"status"} label="status">
                <Select
                  placeholder="Select status"
                  options={[
                    {
                      label: "Active",
                      value: 1,
                    },
                    {
                      label: "InActive",
                      value: 0,
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name={"description"} label="description">
                <Input placeholder="description" />
              </Form.Item>
            </Col>
          </Row>
          {/* Upload Single Image File */}
          {/* <Form.Item name={"image_default"} label="Image">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
                // options.onProgress({ percent: 0 });
                // options.onProgress({ percent: 100 });
              }}
              // accept=""
              maxCount={1}
              listType="picture-card"
              fileList={imageDefault}
              onPreview={handlePreview}
              onChange={handleChangeImageDefault}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item> */}
          {/* Upload Multiple Image Files */}
          {/* <Form.Item name={"image_optional"} label="Image (Optional)">
            <Upload
              customRequest={(options) => {
                options.onSuccess();
              }}
              listType="picture-card"
              multiple={true}
              maxCount={4}
              fileList={imageOptional}
              onPreview={handlePreview}
              onChange={handleChangeImageOptional}
            >
              <div>+Upload</div>
            </Upload>
          </Form.Item> */}

          {/* {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          <div style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={onCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </div> */}
        </Form>
      </Modal>

      <Modal open={state.visibleModal} onCancel={onCloseModal} footer={null}>
        <div className="flex justify-between xs:px-1">
          <div className="font-bold xs:text-xs flex items-center">
            Items : {cart.length}
          </div>
        </div>
        {cart.map((item, index) => (
          <AddedTocart
            key={item.barcode}
            {...item}
            handleIncrease={() => handleIncrease(item, index)}
            handleDescrease={() => handleDescrease(item, index)}
            handleRemove={() => handleRemove(item, index)}
          />
        ))}
        {!cart.length && <Empty />}
        <div>
          <div className="flex justify-between p-1 border-b-2 xs:text-[10px]">
            <div>Total Qty </div>
            <div>{objSummary.total_qty} PCS</div>
          </div>
          <div className="flex justify-between p-1 border-b-2 xs:text-[10px]">
            <div>Sub total </div>
            <div>{objSummary.sub_total}$</div>
          </div>
          <div className="flex justify-between p-1 border-b border-gray-950 xs:text-[10px]">
            <div>Save($) </div>
            <div>{objSummary.save_discount}$</div>
          </div>
          <div className="flex justify-between p-1 xs:text-[10px]">
            <div className="font-bold">Total </div>
            <div className="font-bold">
              {objSummary.total}
              <span className="select-none">$</span>
            </div>
          </div>
          <div>
            <Space>
              {/* <Button
                danger
                type="primary"
                onClick={handleClearCart}
                disabled={cart.length === 0}
              >
                Clear
              </Button>
              <Button onClick={onCloseModal}>Cancel</Button> */}
              <Button onClick={handleOrder}>Place Order</Button>
            </Space>
          </div>
        </div>
      </Modal>
      <MainPage loading={false}>
        <Content class="bg-slate-400 h-screen ">
          <Menu className="bg-red-500 sticky top-0 flex justify-between items-center p-3 z-50 shadow-md">
            {/* Left Side */}
            <div className="flex items-center">
              <img
                className="xl:w-14 rounded-full mr-3 xs:w-7 xxs:w-7"
                src={Logo}
                alt="Logo"
              />
              <div className="flex flex-col">
                <p className="text-lg font-bold">POS</p>
                <p className="text-sm hidden-992">Computer & Phone Shop</p>
              </div>
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
              <div className="text-right">
                <div className="text-xs font-bold hidden-992"></div>
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
                  src={
                    customerProfile.image
                      ? Config.image_path + customerProfile.image
                      : User
                  }
                  // src={User}
                  alt="User"
                />
              </Dropdown>
            </div>
            {/* Right Side */}
          </Menu>

          <Outlet />
        </Content>
      </MainPage>
    </ConfigProvider>
  );
}
export default MainLayoutClient;
