import React, { useEffect, useState } from "react";
import { request } from "../../../util/helper";
import MainPage from "../../../component/layout/MainPage";
import { Button, Form, Input, message, Modal, Space, Table } from "antd";
import dayjs from "dayjs";

function SupplierPage() {
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
    const res = await request("supplier", "get", param);
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

  const onClickBtnEdit = (items) => {
    form.setFieldsValue({
      ...items,
      id: items.id,
    });
    openModal();
  };

  const onClickBtnDelete = (items) => {
    Modal.confirm({
      title: "Delete Suppler",
      content: "Are you sure to delete?",
      onOk: async () => {
        setState((p) => ({
          ...p,
          loading: true,
        }));
        const res = await request("supplier", "delete", {
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
    const res = await request("supplier", method, {
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
          <div>Supplier</div>
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
        title={form.getFieldValue("id") ? "Edit Supplier" : "New Supplier"}
        onCancel={closeModal}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="name"
            label="name"
            rules={[
              {
                required: true,
                message: "Name required!",
              },
            ]}
          >
            <Input placeholder="code" />
          </Form.Item>
          <Form.Item
            name="code"
            label="code"
            rules={[
              {
                required: true,
                message: "Code required!",
              },
            ]}
          >
            <Input placeholder="Code" />
          </Form.Item>
          <Form.Item
            name="tel"
            label="tel"
            rules={[
              {
                required: true,
                message: "Telephone required!",
              },
            ]}
          >
            <Input placeholder="tel" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "email required!",
              },
            ]}
          >
            <Input placeholder="email" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "address required!",
              },
            ]}
          >
            <Input placeholder="address" />
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[
              {
                required: true,
                message: "website required!",
              },
            ]}
          >
            <Input placeholder="website" />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea placeholder="note" />
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
            title: "No",
            render: (item, data, index) => index + 1,
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "code",
            title: "Code",
            dataIndex: "code",
          },
          {
            key: "tel",
            title: "Telephone",
            dataIndex: "tel",
          },
          {
            key: "email",
            title: "Email",
            dataIndex: "email",
          },
          {
            key: "address",
            title: "Address",
            dataIndex: "address",
          },
          {
            key: "website",
            title: "Website",
            dataIndex: "website",
          },
          {
            key: "create_at",
            title: "Create at",
            dataIndex: "create_at",
            render: (value) => dayjs(value).format("DD/MM/YYYY"),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (value, data) => (
              <Space>
                <Button type="primary" onClick={() => onClickBtnEdit(data)}>
                  EDIT
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => onClickBtnDelete(data)}
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

export default SupplierPage;
