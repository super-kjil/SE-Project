import React, { useCallback, useEffect, useState } from "react";
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
} from "antd";

import { request } from "../util/helper";
import MainPage from "../component/layout/MainPage";
import { configStore, useHomeCartStore } from "../store/configStore";
import ProductItem from "../component/pos/ProductItem";
import AddedTocart from "../component/clientPage/AddedTocart";
import Carousel from "../component/clientPage/Carousel";

function HomePageClient() {
  const {
    cart,
    loadCart,
    addToCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useHomeCartStore();

  const { config } = configStore();

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
  });

  const [filter, setFilter] = useState({
    txt_search: "",
    category_id: "",
    brand: "",
  });

  useEffect(() => {
    // handleCalSummary();
    loadCart();
    getList();
  }, [filter]);

  // useEffect(() => {
  //   handleCalSummary();
  // }, [cart]);

  // const getList = async () => {
  //   const param = {
  //     ...filter,
  //     page: 1,
  //     is_list_all: 1,
  //   };
  //   setState((pre) => ({ ...pre, loading: true }));
  //   const res = await request("product", "get", param);
  //   if (res && !res.error) {
  //     setState((pre) => ({
  //       ...pre,
  //       list: res.list,
  //       total: res.total,
  //       loading: false,
  //     }));
  //   } else {
  //     setState((pre) => ({ ...pre, loading: false }));
  //   }
  // };
  const refPage = React.useRef(1);

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
  const handleAdd = (item) => {
    addToCart(item);
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
        {/* <Carousel /> */}
        <div className="pt-8 flex items-center justify-center">
          <div className="xl:w-4/5 flex items-center justify-center xs:w-11/12">
            <Row gutter={[8, 4]}>
              {state.list.map((item, index) => (
                <Col key={index} xs={8} sm={12} md={8} lg={6} xl={6} xxl={4}>
                  <ProductItem {...item} handleAdd={() => handleAdd(item)} />
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </MainPage>
    </ConfigProvider>
  );
}

export default HomePageClient;
