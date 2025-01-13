import React, { useCallback, useEffect, useState } from "react";
import {
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
} from "antd";
import { request } from "../../../util/helper";
import MainPage from "../../../component/layout/MainPage";
import { configStore, useCartStore } from "../../../store/configStore";
import ProductItem from "../../../component/pos/ProductItem";
import BillItem from "../../../component/pos/BillItem";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "../../../component/pos/PrintInvoice";
import Calculator from "../../../component/pos/Calculator";
import { FaCalculator } from "react-icons/fa6";

function PosPage() {
  const {
    cart,
    loadCart,
    addToBill,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  const { config } = configStore();
  const refInvoice = React.useRef(null);
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    visibleModal: false,
  });

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

  const refPage = React.useRef(1);

  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  useEffect(() => {
    loadCart();
    getList();
  }, [filter]);

  useEffect(() => {
    handleCalSummary();
  }, [cart]);

  const getList = async () => {
    var param = {
      ...filter,
      page: refPage.current,
      is_list_all: 1,
    };
    setState((pre) => ({ ...pre, loading: true }));
    const res = await request("product", "get", param);
    if (res && !res.error) {
      if (res.list?.length == 1) {
        handleAdd(res.list[0]);
        setState((pre) => ({ ...pre, loading: false }));
        return; //
      }
      setState((pre) => ({
        ...pre,
        list: res.list,
        total: refPage.current == 1 ? res.total : pre.total,
        loading: false,
      }));
    }
  };
  const handleClearCart = () => {
    clearCart();
    setObjSummary((p) => ({
      ...p,
      sub_total: 0,
      total_qty: 0,
      save_discount: 0,
      tax: 10,
      total: 0,
      total_paid: 0,
    }));
  };

  const handleAdd = (item) => {
    addToBill(item);
  };

  const handleIncrease = (item) => {
    addToBill(item);
  };

  const handleDescrease = (item) => {
    if (item.cart_qty > 1) {
      decreaseQuantity(item.barcode);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.barcode);
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

  // const handleClickOut = async () => {
  //   var order_details = [];
  //   cart.forEach((item) => {
  //     var total = Number(item.cart_qty) * Number(item.price);
  //     if (item.discount != null && item.discount != 0) {
  //       total = total - (total * Number(item.discount)) / 100;
  //     }
  //     var objItem = {
  //       proudct_id: item.id,
  //       qty: Number(item.cart_qty),
  //       price: Number(item.price),
  //       discount: Number(item.discount),
  //       total: total,
  //     };
  //     order_details.push(objItem);
  //   });
  //   var param = {
  //     order: {
  //       customer_id: objSummary.customer_id,
  //       total_amount: objSummary.total,
  //       paid_amount: objSummary.total_paid,
  //       payment_method: objSummary.payment_method,
  //       remark: objSummary.remark,
  //     },
  //     order_details: order_details,
  //   };
  //   const res = await request("order", "post", param);
  //   if (res && !res.error) {
  //     if (res.order) {
  //       message.success("Order created success!");
  //       setObjSummary((p) => ({
  //         ...p,
  //         order_no: res.order?.order_no,
  //         order_date: res.order?.create_at,
  //       }));
  //       setTimeout(() => {
  //         handlePrintInvoice(); // open print dialog
  //       }, 2000);
  //     }
  //   } else {
  //     message.success("Order not complete!");
  //   }
  // };

  const handleClickOut = async () => {
    // Validation for required fields
    if (!objSummary.customer_id) {
      message.error("Please select a customer before proceeding to checkout.");
      return;
    }
    if (!objSummary.payment_method) {
      message.error(
        "Please select a payment method before proceeding to checkout."
      );
      return;
    }
    if (!objSummary.total_paid || objSummary.total_paid <= 0) {
      message.error("Please enter a valid amount to be paid.");
      return;
    }

    // Proceed with the checkout process
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
        message.success("Order created successfully!");
        setObjSummary((p) => ({
          ...p,
          order_no: res.order?.order_no,
          order_date: res.order?.create_at,
        }));
        setTimeout(() => {
          handlePrintInvoice(); // Open print dialog
        }, 2000);
      }
    } else {
      message.error("Order not complete!");
    }
  };

  const onBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
    return Promise.resolve();
  }, []);

  const onAfterPrint = React.useCallback((event) => {
    handleClearCart();
    console.log("`onAfterPrint` called", event);
  }, []);

  const onPrintError = React.useCallback(() => {
    console.log("`onPrintError` called");
  }, []);

  const handlePrintInvoice = useReactToPrint({
    contentRef: refInvoice,
    onBeforePrint: onBeforePrint,
    onAfterPrint: onAfterPrint,
    onPrintError: onPrintError,
  });
  const handleCloseModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: false,
    }));
  };
  const handleOpenModal = () => {
    setState((p) => ({
      ...p,
      visibleModal: true,
    }));
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 10,
        },
      }}
    >
      <MainPage loading={state.loading}>
        <div className="hidden">
          <PrintInvoice
            ref={refInvoice}
            cart_list={cart}
            objSummary={objSummary}
          />
        </div>
        <Modal
          onCancel={handleCloseModal}
          open={state.visibleModal}
          footer={null}
        >
          <div>
            <Calculator />
          </div>
        </Modal>
        {/* Header filter */}
        <div className="2xl:mb-2 xs:mb-2">
          <Space size={"middle"}>
            <p className="2xl:font-bold 2xl:text-xl xl:font-bold xl:text-xl hidden-992">
              Product : {state.total}
            </p>
            <Input
              className="2xl:rounded-xl hidden-992"
              onChange={(event) =>
                setFilter((p) => ({ ...p, txt_search: event.target.value }))
              }
              allowClear
              placeholder="Search"
              onSearch={() => getList()}
            />
            <Select
              allowClear
              className="2xl:w-32 xs:w-25 size-fit"
              placeholder="Category"
              options={config.category}
              onChange={(id) => {
                setFilter((pre) => ({ ...pre, category_id: id }));
              }}
            />
            <Select
              allowClear
              className="2xl:w-32 xs:w-25 size-fit"
              placeholder="Brand"
              options={config.brand}
              onChange={(id) => {
                setFilter((pre) => ({ ...pre, brand: id }));
              }}
            />
            <button onClick={handleOpenModal}>
              <FaCalculator className="flex justify-center items-center flex-end size-5" />
            </button>
          </Space>
        </div>
        <Row
          gutter={{
            xs: 4,
            sm: 16,
            md: 24,
            lg: 32,
            xl: 40,
          }}
          className="w-full m-0"
        >
          <Col xs={12} sm={12} md={12} lg={16} xl={16} xxl={18}>
            <Row gutter={[8, 4]}>
              {state.list.map((item, index) => (
                <Col key={index} xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                  <ProductItem {...item} handleAdd={() => handleAdd(item)} />
                </Col>
              ))}
            </Row>
          </Col>
          {/* Item cart */}
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={8}
            xl={8}
            xxl={6}
            className="shadow-lg bg-white rounded-xl p-2"
          >
            <div className="flex justify-between xs:px-1">
              <div className="font-bold xs:text-xs flex items-center">
                Items : {cart.length}
              </div>
              <Button
                className="xs:text-[10px] xs:size-fit"
                danger
                type="primary"
                onClick={handleClearCart}
              >
                Clear
              </Button>
            </div>
            {cart.map((item, index) => (
              <BillItem
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
            </div>
            <div>
              <Row gutter={[6, 6]} className="mt-2">
                <Col span={12}>
                  <Select
                    className="w-full"
                    placeholder="Select Customer"
                    options={config?.customer}
                    onSelect={(value) => {
                      setObjSummary((p) => ({
                        ...p,
                        customer_id: value,
                      }));
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Select
                    className="w-full"
                    placeholder="Select Payment"
                    options={[
                      {
                        label: "Cash",
                        value: "Cash",
                      },
                      {
                        label: "Wing",
                        value: "Wing",
                      },
                      {
                        label: "ABA",
                        value: "ABA",
                      },
                      {
                        label: "AC",
                        value: "AC",
                      },
                    ]}
                    onSelect={(value) => {
                      setObjSummary((p) => ({
                        ...p,
                        payment_method: value,
                      }));
                    }}
                  />
                </Col>
                <Col span={24}>
                  <Input
                    placeholder="Remark"
                    onChange={(e) => {
                      setObjSummary((p) => ({ ...p, remark: e.target.value }));
                    }}
                  />
                </Col>
              </Row>
              <Row gutter={[8, 8]} className="mt-2">
                <Col span={12}>
                  <InputNumber
                    rules={[
                      { required: true, message: "Please input a number!" },
                      {
                        pattern: /^\d+$/,
                        message: "Only numbers are allowed!",
                      },
                    ]}
                    className="w-full "
                    placeholder="Amount to paid"
                    value={objSummary.total_paid}
                    onChange={(value) => {
                      setObjSummary((p) => ({ ...p, total_paid: value }));
                    }}
                  />
                </Col>
                <Col span={12}>
                  <Button
                    disabled={cart.length == 0}
                    block
                    type="primary"
                    onClick={handleClickOut}
                  >
                    Checkout
                  </Button>
                </Col>
                {/* <Calculator /> */}
              </Row>
            </div>
          </Col>
        </Row>
      </MainPage>
    </ConfigProvider>
  );
}

export default PosPage;

// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Button,
//   Col,
//   ConfigProvider,
//   Empty,
//   Input,
//   InputNumber,
//   message,
//   notification,
//   Row,
//   Select,
//   Space,
// } from "antd";
// import { request } from "../../../util/helper";
// import MainPage from "../../../component/layout/MainPage";
// import { configStore, useCartStore } from "../../../store/configStore";
// import ProductItem from "../../../component/pos/ProductItem";
// import BillItem from "../../../component/pos/BillItem";
// import { useReactToPrint } from "react-to-print";
// import PrintInvoice from "../../../component/pos/PrintInvoice";

// function PosPage() {
//   const {
//     cart,
//     loadCart,
//     addToCart,
//     clearCart,
//     increaseQuantity,
//     decreaseQuantity,
//     removeFromCart,
//   } = useCartStore();

//   const { config } = configStore();
//   const refInvoice = React.useRef(null);
//   const [state, setState] = useState({
//     list: [],
//     total: 0,
//     loading: false,
//     visibleModal: false,
//   });

//   const [objSummary, setObjSummary] = useState({
//     sub_total: 0,
//     total_qty: 0,
//     save_discount: 0,
//     tax: 10,
//     total: 0,
//     total_paid: 0,
//     customer_id: null,
//     payment_method: null,
//     remark: null,

//     order_no: null, // set after order
//     order_date: null, // set after order
//   });

//   const refPage = React.useRef(1);

//   const [filter, setFilter] = useState({
//     txt_search: "",
//     category_id: "",
//     brand: "",
//   });

//   useEffect(() => {
//     loadCart();
//     getList();
//   }, [filter]);

//   useEffect(() => {
//     handleCalSummary();
//   }, [cart]);

//   const getList = async () => {
//     var param = {
//       ...filter,
//       page: refPage.current,
//       is_list_all: 1,
//     };
//     setState((pre) => ({ ...pre, loading: true }));
//     const res = await request("product", "get", param);
//     if (res && !res.error) {
//       if (res.list?.length == 1) {
//         handleAdd(res.list[0]);
//         setState((pre) => ({ ...pre, loading: false }));
//         return; //
//       }
//       setState((pre) => ({
//         ...pre,
//         list: res.list,
//         total: refPage.current == 1 ? res.total : pre.total,
//         loading: false,
//       }));
//     }
//   };

//   const handleAdd = (item) => {
//     addToCart(item);
//   };

//   const handleClearCart = () => {
//     clearCart();
//     setObjSummary((p) => ({
//       ...p,
//       sub_total: 0,
//       total_qty: 0,
//       save_discount: 0,
//       tax: 10,
//       total: 0,
//       total_paid: 0,
//     }));
//   };

//   const handleIncrease = (item) => {
//     increaseQuantity(item.barcode);
//   };

//   const handleDescrease = (item) => {
//     if (item.cart_qty > 1) {
//       decreaseQuantity(item.barcode);
//     }
//   };

//   const handleRemove = (item) => {
//     removeFromCart(item.barcode);
//   };

//   const handleCalSummary = useCallback(() => {
//     let total_qty = 0,
//       sub_total = 0,
//       save_discount = 0,
//       total = 0,
//       original_total = 0;

//     cart.map((item) => {
//       total_qty += item.cart_qty; // done
//       var final_price = item.price;
//       if (item.discount != 0 && item.discount != null) {
//         final_price = item.price - (item.price * item.discount) / 100;
//         final_price = final_price.toFixed(2);
//       }
//       original_total += item.cart_qty * item.price;
//       sub_total += item.cart_qty * final_price;
//     });
//     total = sub_total;
//     save_discount = original_total - sub_total;
//     setObjSummary((p) => ({
//       ...p,
//       total_qty: total_qty,
//       sub_total: sub_total.toFixed(2),
//       save_discount: save_discount.toFixed(2),
//       total: total.toFixed(2),
//     }));
//   }, [cart]);

//   const handleClickOut = async () => {
//     var order_details = [];
//     cart.forEach((item) => {
//       var total = Number(item.cart_qty) * Number(item.price);
//       if (item.discount != null && item.discount != 0) {
//         total = total - (total * Number(item.discount)) / 100;
//       }
//       var objItem = {
//         proudct_id: item.id,
//         qty: Number(item.cart_qty),
//         price: Number(item.price),
//         discount: Number(item.discount),
//         total: total,
//       };
//       order_details.push(objItem);
//     });
//     var param = {
//       order: {
//         customer_id: objSummary.customer_id,
//         total_amount: objSummary.total,
//         paid_amount: objSummary.total_paid,
//         payment_method: objSummary.payment_method,
//         remark: objSummary.remark,
//       },
//       order_details: order_details,
//     };
//     const res = await request("order", "post", param);
//     if (res && !res.error) {
//       if (res.order) {
//         message.success("Order created success!");
//         setObjSummary((p) => ({
//           ...p,
//           order_no: res.order?.order_no,
//           order_date: res.order?.create_at,
//         }));
//         setTimeout(() => {
//           handlePrintInvoice(); // open print dialog
//         }, 2000);
//       }
//     } else {
//       message.success("Order not complete!");
//     }
//   };

//   const onBeforePrint = React.useCallback(() => {
//     console.log("`onBeforePrint` called");
//     return Promise.resolve();
//   }, []);

//   const onAfterPrint = React.useCallback((event) => {
//     handleClearCart();
//     console.log("`onAfterPrint` called", event);
//   }, []);

//   const onPrintError = React.useCallback(() => {
//     console.log("`onPrintError` called");
//   }, []);

//   const handlePrintInvoice = useReactToPrint({
//     contentRef: refInvoice,
//     onBeforePrint: onBeforePrint,
//     onAfterPrint: onAfterPrint,
//     onPrintError: onPrintError,
//   });

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           borderRadius: 10,
//         },
//       }}
//     >
//       <MainPage loading={state.loading}>
//         <div className="hidden">
//           <PrintInvoice
//             ref={refInvoice}
//             cart_list={cart}
//             objSummary={objSummary}
//           />
//         </div>
//         {/* Header filter */}
//         <div className="2xl:mb-2 xs:mb-2">
//           <Space size={"middle"}>
//             <p className="2xl:font-bold 2xl:text-xl xl:font-bold xl:text-xl hidden-992">
//               Product : {state.total}
//             </p>
//             <Input
//               className="2xl:rounded-xl hidden-992"
//               onChange={(event) =>
//                 setFilter((p) => ({ ...p, txt_search: event.target.value }))
//               }
//               allowClear
//               placeholder="Search"
//               onSearch={() => getList()}
//             />
//             <Select
//               allowClear
//               className="2xl:w-32 xs:w-25 size-fit"
//               placeholder="Category"
//               options={config.category}
//               onChange={(id) => {
//                 setFilter((pre) => ({ ...pre, category_id: id }));
//               }}
//             />
//             <Select
//               allowClear
//               className="2xl:w-32 xs:w-25 size-fit"
//               placeholder="Brand"
//               options={config.brand}
//               onChange={(id) => {
//                 setFilter((pre) => ({ ...pre, brand: id }));
//               }}
//             />
//           </Space>
//         </div>
//         <Row
//           gutter={{
//             xs: 4,
//             sm: 16,
//             md: 24,
//             lg: 32,
//             xl: 40,
//           }}
//           className="w-full m-0"
//         >
//           <Col xs={12} sm={12} md={12} lg={16} xl={16} xxl={18}>
//             <Row gutter={[8, 4]}>
//               {state.list.map((item, index) => (
//                 <Col key={index} xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
//                   <ProductItem {...item} handleAdd={() => handleAdd(item)} />
//                 </Col>
//               ))}
//             </Row>
//           </Col>
//           {/* Item cart */}
//           <Col
//             xs={12}
//             sm={12}
//             md={12}
//             lg={8}
//             xl={8}
//             xxl={6}
//             className="shadow-lg bg-white rounded-xl p-2"
//           >
//             <div className="flex justify-between xs:px-1">
//               <div className="font-bold xs:text-xs flex items-center">
//                 Items : {cart.length}
//               </div>
//               <Button
//                 className="xs:text-[10px] xs:size-fit"
//                 danger
//                 type="primary"
//                 onClick={handleClearCart}
//               >
//                 Clear
//               </Button>
//             </div>
//             {cart.map((item, index) => (
//               <BillItem
//                 key={index}
//                 {...item}
//                 handleIncrease={() => handleIncrease(item)}
//                 handleDescrease={() => handleDescrease(item)}
//                 handleRemove={() => handleRemove(item)}
//               />
//             ))}
//             {!cart.length && <Empty />}
//             <div>
//               <div className="flex justify-between p-1 border-b-2 xs:text-[10px]">
//                 <div>Total Qty </div>
//                 <div>{objSummary.total_qty} PCS</div>
//               </div>
//               <div className="flex justify-between p-1 border-b-2 xs:text-[10px]">
//                 <div>Sub total </div>
//                 <div>{objSummary.sub_total}$</div>
//               </div>
//               <div className="flex justify-between p-1 border-b border-gray-950 xs:text-[10px]">
//                 <div>Save($) </div>
//                 <div>{objSummary.save_discount}$</div>
//               </div>
//               <div className="flex justify-between p-1 xs:text-[10px]">
//                 <div className="font-bold">Total </div>
//                 <div className="font-bold">
//                   {objSummary.total}
//                   <span className="select-none">$</span>
//                 </div>
//               </div>
//             </div>
//             <div>
//               <Row gutter={[6, 6]} className="mt-2">
//                 <Col span={12}>
//                   <Select
//                     className="w-full"
//                     placeholder="Select Customer"
//                     options={config?.customer}
//                     onSelect={(value) => {
//                       setObjSummary((p) => ({
//                         ...p,
//                         customer_id: value,
//                       }));
//                     }}
//                   />
//                 </Col>
//                 <Col span={12}>
//                   <Select
//                     className="w-full"
//                     placeholder="Select Payment"
//                     options={[
//                       {
//                         label: "Cash",
//                         value: "Cash",
//                       },
//                       {
//                         label: "Wing",
//                         value: "Wing",
//                       },
//                       {
//                         label: "ABA",
//                         value: "ABA",
//                       },
//                       {
//                         label: "AC",
//                         value: "AC",
//                       },
//                     ]}
//                     onSelect={(value) => {
//                       setObjSummary((p) => ({
//                         ...p,
//                         payment_method: value,
//                       }));
//                     }}
//                   />
//                 </Col>
//                 <Col span={24}>
//                   <Input
//                     placeholder="Remark"
//                     onChange={(e) => {
//                       setObjSummary((p) => ({ ...p, remark: e.target.value }));
//                     }}
//                   />
//                 </Col>
//               </Row>
//               <Row gutter={[8, 8]} className="mt-2">
//                 <Col span={12}>
//                   <InputNumber
//                     className="w-full "
//                     placeholder="Amount to paid"
//                     value={objSummary.total_paid}
//                     onChange={(value) => {
//                       setObjSummary((p) => ({ ...p, total_paid: value }));
//                     }}
//                   />
//                 </Col>
//                 <Col span={12}>
//                   <Button
//                     disabled={cart.length == 0}
//                     block
//                     type="primary"
//                     onClick={handleClickOut}
//                   >
//                     Checkout
//                   </Button>
//                 </Col>
//               </Row>
//             </div>
//           </Col>
//         </Row>
//       </MainPage>
//     </ConfigProvider>
//   );
// }

// export default PosPage;
