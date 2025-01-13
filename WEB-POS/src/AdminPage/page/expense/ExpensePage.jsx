import React, { useEffect, useState } from "react";
import { request } from "../../../util/helper";
import MainPage from "../../../component/layout/MainPage";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import DatePickerCom from "../../../component/datePicker/DatePickerCom";

function ExpensePage() {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    loading: false,
    visible: false,
    txtSearch: "",
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setState((p) => ({
      ...p,
      loading: true,
    }));
    var param = {
      txtSearch: state.txtSearch,
    };
    const res = await request("expense", "get", param);
    //setloading(false);
    if (res && !res.error) {
      setState((p) => ({
        ...p,
        list: res.list,
        loading: false,
      }));
    }
  };
  const openModal = () => {
    setState((p) => ({
      ...p,
      visible: true,
    }));
  };

  const closeModal = () => {
    setState((p) => ({
      ...p,
      visible: false,
    }));
    form.resetFields();
  };

  const onClickEdit = (items, index) => {
    form.setFieldsValue({
      ...items,
      id: items.id,
    });
    openModal();
  };

  const onClickDelete = async (items, index) => {
    Modal.confirm({
      title: "Delete expense",
      content: "Are you sure to delete?",
      //okText: "យល់ព្រម",
      onOk: async () => {
        setState((p) => ({
          ...p,
          loading: true,
        }));
        const res = await request("expense", "delete", {
          id: items.id,
        });
        if (res && !res.error) {
          const newList = state.list.filter((item) => item.id != items.id);
          setState((p) => ({
            ...p,
            list: newList,
            loading: false,
          }));
          // getList();
          message.success(res.message);
        }
      },
    });
  };

  const onFinish = async (items) => {
    var method = "post";
    if (form.getFieldValue("id")) {
      method = "put";
    }
    setState((p) => ({
      ...p,
      loading: true,
    }));
    const res = await request("expense", method, {
      ...items,
      id: form.getFieldValue("id"),
    });
    if (res && !res.error) {
      getList();
      closeModal();
      message.success(res.message);
    }
  };

  return (
    <MainPage loading={state.loading}>
      <div className="pageHeader">
        <Space>
          <div>expense</div>
          <Input.Search
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="Search"
          />
        </Space>
        <Button type="primary" onClick={openModal}>
          NEW
        </Button>
      </div>
      <Modal
        open={state.visible}
        title={form.getFieldValue("id") ? "Edit expense" : "New expense"}
        onCancel={closeModal}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name={"name"}
            label="Expense name"
            rules={[
              {
                required: true,
                message: "Name required!",
              },
            ]}
          >
            <Input placeholder="Input expense name" />
          </Form.Item>
          <Form.Item
            name={"amount"}
            label="Amount"
            rules={[
              {
                required: true,
                message: "Amount required!",
              },
            ]}
          >
            <Input placeholder="Amount" />
          </Form.Item>

          <Form.Item label="Expense Date">
            <div style={{ width: "100%" }}>
              <DatePickerCom />
            </div>
          </Form.Item>

          <Form.Item
            name={"remark"}
            label="Remark"
            rules={[
              {
                required: true,
                message: "Remark required!",
              },
            ]}
          >
            <Input.TextArea placeholder="Remark" />
          </Form.Item>
          <Form.Item name={"type"} label="Expense Type">
            <Select
              placeholder="Select Expense Type"
              options={[
                {
                  label: "Mobile card",
                  value: "Mobile card",
                },
                {
                  label: "Cub",
                  value: "Cub",
                },
                {
                  label: "Cafe",
                  value: "Cafe",
                },
                {
                  label: "Sugar",
                  value: "Sugar",
                },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button onClick={closeModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={state.list}
        columns={[
          {
            key: "No",
            title: "No.",
            render: (item, data, index) => index + 1,
          },
          {
            key: "expense_type",
            title: "Expense Type",
            dataIndex: "expense_type",
          },
          {
            key: "ref_no",
            title: "Ref No.",
            dataIndex: "ref_no",
          },
          ,
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          ,
          {
            key: "amount",
            title: "Amount",
            dataIndex: "amount",
          },
          ,
          {
            key: "remark",
            title: "Remark",
            dataIndex: "remark",
          },

          {
            key: "expense_date",
            title: "Expense Date",
            dataIndex: "expense_date",
            render: (value) => dayjs(value).format("DD/MM/YYYY"),
          },
          {
            key: "create_at",
            title: "Create At",
            dataIndex: "create_at",
            render: (value) => dayjs(value).format("DD/MM/YYYY"),
          },
          {
            key: "create_by",
            title: "Create By",
            dataIndex: "create_by",
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
                  onClick={() => onClickEdit(data, index)}
                >
                  {" "}
                  EDIT
                </Button>
                <Button
                  type="primary"
                  danger
                  //icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                >
                  DELETE
                </Button>
              </Space>
            ),
          },
        ]}
      />
    </MainPage>
  );
}

export default ExpensePage;
