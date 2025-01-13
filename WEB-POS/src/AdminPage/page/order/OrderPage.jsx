import { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { formatDateServer, request } from "../../../util/helper";
import { MdDelete, MdEdit } from "react-icons/md";
import MainPage from "../../../component/layout/MainPage";
import dayjs from "dayjs";
import { Config } from "../../../util/config";
function OrderPage() {
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    descriptoin: "",
    status: "",
    parentId: null,
    txtSearch: "",
  });
  const [filter, setFilter] = useState({
    from_date: dayjs(),
    to_date: dayjs(),
  });
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    // var param = {
    //   txtSearch: state.txtSearch,
    //   from_date: formatDateServer(filter.from_date),
    //   to_date: formatDateServer(filter.to_date),
    // };
    var param = {
      txtSearch: state.txtSearch,
      from_date: formatDateServer(filter.from_date),
      to_date: formatDateServer(filter.to_date),
    };

    ////////////////////////
    // alert(JSON.stringify(param))
    // console.log(getList)
    // return
    ////////////////////////
    // setLoading(true);
    const res = await request("order", "get", param);
    // setLoading(false);
    if (res) {
      setList(res.list);
      setSummary(res.summary);
    }
  };
  const getOrderDetail = async (data) => {
    setLoading(true);
    const res = await request("order_detail/" + data.id, "get");
    setLoading(false);
    if (res) {
      setOrderDetail(res.list);
      setState({
        ...state,
        visibleModal: true,
      });
    }
  };
  const onClickDelete = async (data) => {
    Modal.confirm({
      title: "លុ​ប",
      descriptoin: "Are you sure to remove?",
      okText: "យល់ព្រម",
      onOk: async () => {
        const res = await request("order", "delete", {
          id: data.id,
        });
        if (res && !res.error) {
          // getList(); // request to api response
          // remove in local
          message.success(res.message);
          const newList = list.filter((item) => item.id != data.id);
          setList(newList);
        }
      },
    });
  };
  const onClickAddBtn = () => {
    setState({
      ...state,
      visibleModal: true,
    });
  };
  const onCloseModal = () => {
    formRef.resetFields();
    setState({
      ...state,
      visibleModal: false,
      id: null,
    });
  };

  const onFinish = async (items) => {
    var data = {
      id: formRef.getFieldValue("id"),
      name: items.name,
      description: items.description,
      status: items.status,
      parent_id: 0,
    };
    var method = "post";
    if (formRef.getFieldValue("id")) {
      // case update
      method = "put";
    }
    const res = await request("order", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      onCloseModal();
    }
  };
  return (
    <MainPage loading={loading}>
      <div className="pageHeader">
        <Space>
          <div>
            <div className="font-bold">Order</div>
            <div className="font-bold">
              Total : {summary?.total_order || 0} | {summary?.total_amount || 0}
              ${" "}
            </div>
          </div>
          <Input.Search
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="Search"
          />
          <DatePicker.RangePicker
            defaultValue={[
              dayjs(filter.from_date, "DD-MM-YYYY"),
              dayjs(filter.to_date, "DD-MM-YYYY"),
            ]}
            format={"DD-MM-YYYY"}
            onChange={(value) => {
              setFilter((p) => ({
                ...p,
                from_date: value[0],
                to_date: value[1],
              }));
            }}
            // onChange={(value) => {
            //   if (value) {
            //     setFilter((p) => ({
            //       ...p,
            //       from_date: value[0],
            //       to_date: value[1],
            //     }));
            //   }
            // }}
          />
          <Button type="primary" onClick={getList}>
            Filter
          </Button>
        </Space>
      </div>
      <Modal
        open={state.visibleModal}
        title={"Order Details"}
        footer={null}
        onCancel={onCloseModal}
        width={800}
      >
        <Table
          pagination={false}
          dataSource={orderDetail}
          columns={[
            {
              key: "p_name",
              title: "product",
              dataIndex: "p_name",
              render: (item, data) => {
                <div>
                  <div className="font-bold">{data.p_name}</div>
                  <div>
                    {data.p_category} | {data.p_brand}
                  </div>
                  <div>{data.p_desc}</div>
                </div>;
              },
            },
            {
              key: "p_image",
              title: "image",
              dataIndex: "p_image",
              render: (value) => (
                <Image src={Config.image_path + value} alt="" />
              ),
            },
            {
              key: "qty",
              title: "qty",
              dataIndex: "qty",
            },
            {
              key: "price",
              title: "price",
              dataIndex: "price",
              render: (value) => <Tag>${value}</Tag>,
            },
            {
              key: "discount",
              title: "discount",
              dataIndex: "discount",
              render: (value) => <Tag>%{value}</Tag>,
            },
            {
              key: "total",
              title: "total",
              dataIndex: "total",
              render: (value) => <Tag>${value}</Tag>,
            },
          ]}
        ></Table>
      </Modal>
      <Table
        // style={{ borderRadius: 10 }}
        dataSource={list}
        columns={[
          {
            key: "No",
            title: "No",
            render: (item, data, index) => index + 1,
          },
          {
            key: "order_no",
            title: "order_no",
            dataIndex: "order_no",
          },
          {
            key: "customer_name",
            title: "customer_name",
            dataIndex: "customer_name",
            render: (value, data) => (
              <div>
                <div>{data.customer_name}</div>
                <div>{data.customer_tel}</div>
                <div>{data.customer_address}</div>
              </div>
            ),
          },

          {
            key: "total_amount",
            title: "total_amount",
            dataIndex: "total_amount",
          },
          {
            key: "paid_amount",
            title: "paid_amount",
            dataIndex: "paid_amount",
          },
          {
            key: "Due",
            title: "Due",
            render: (value, data) => (
              <Tag color="red">
                {(Number(data.total_amount) - Number(data.paid_amount)).toFixed(
                  2
                )}
              </Tag>
            ),
          },
          {
            key: "payment_method",
            title: "payment_method",
            dataIndex: "payment_method",
          },
          {
            key: "remark",
            title: "remark",
            dataIndex: "remark",
          },
          {
            key: "create_by",
            title: "create_by",
            dataIndex: "create_by",
          },
          {
            key: "create_at",
            title: "Create at",
            dataIndex: "create_at",
            render: (value) => dayjs(value).format("DD/MM/YYYY"),
          },
          {
            key: "Action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  //icon={<MdEdit />}
                  onClick={() => getOrderDetail(data, index)}
                >
                  {" "}
                  View
                </Button>
                {/* <Button
                  type="primary"
                  danger
                  //icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                  >
                  DELETE
                </Button> */}
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}

export default OrderPage;
