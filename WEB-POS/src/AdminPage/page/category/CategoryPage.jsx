import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { request } from "../../../util/helper";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import MainPage from "../../../component/layout/MainPage";
import { configStore } from "../../../store/configStore";
function CategoryPage() {
  const { config } = configStore();
  const [formRef] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    visibleModal: false,
    id: null,
    name: "",
    descriptoin: "",
    status: "",
    parentId: null,
    txtSearch: "",
  });

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);
    const res = await request("category", "get");
    setLoading(false);
    if (res) {
      setList(res.list);
    }
  };
  const onClickEdit = (data, index) => {
    setState({
      ...state,
      visibleModal: true,
    });
    formRef.setFieldsValue({
      id: data.id, // hiden id (save? | update?)
      name: data.name,
      description: data.description,
      status: data.status,
    });
    //
    // formRef.getFieldValue("id")
  };
  const onClickDelete = async (data, index) => {
    Modal.confirm({
      title: "លុ​ប",
      descriptoin: "Are you sure to remove?",
      okText: "យល់ព្រម",
      onOk: async () => {
        const res = await request("category", "delete", {
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
    const res = await request("category", method, data);
    if (res && !res.error) {
      message.success(res.message);
      getList();
      onCloseModal();
    }
  };

  return (
    <MainPage loading={loading}>
      {/* <div style={{ color: "var(--text-color)" }}>
        <Space>
          <div>Category</div>
          <Input.Search
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="Search"
          />
        </Space>
        <Button style={{justifyContent:"end"}}  type="primary" onClick={onClickAddBtn}>
          NEW
        </Button>
      </div> */}
      <div className="pageHeader">
        <Space>
          <div>Category</div>
          <Input.Search
            onChange={(value) =>
              setState((p) => ({ ...p, txtSearch: value.target.value }))
            }
            allowClear
            onSearch={getList}
            placeholder="Search"
          />
        </Space>
        <Button type="primary" onClick={onClickAddBtn}>
          NEW
        </Button>
      </div>
      <Modal
        open={state.visibleModal}
        title={formRef.getFieldValue("id") ? "Edit Category" : "New Category"}
        footer={null}
        onCancel={onCloseModal}
        style={{
          // backgroundColor: "var(--modal-bg-color)",
          color: "var(--text-color)",
        }}
      >
        <Form layout="vertical" onFinish={onFinish} form={formRef}>
          <Form.Item
            name={"name"}
            label={
              <span style={{ color: "var(--text-color)" }}>Category name</span>
            }
          >
            <Input placeholder="Input Category name" />
          </Form.Item>
          <Form.Item
            name={"description"}
            label={<span style={{ color: "var(--text-color)" }}>Status</span>}
          >
            <Input.TextArea placeholder="description" />
          </Form.Item>
          <Form.Item name={"status"} label="Status">
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
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {formRef.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={list}
        columns={[
          {
            key: "No",
            title: "No",
            render: (text, record, index) => <div>{index + 1}</div>,
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
            render: (text) => (
              <span
                style={{
                  color: "var(--table-row-text)", // Dynamic text color
                }}
              >
                {text}
              </span>
            ),
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
            render: (text) => (
              <span
                style={{
                  color: "var(--table-row-text)", // Dynamic text color
                }}
              >
                {text}
              </span>
            ),
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (status) =>
              status ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">InActive</Tag>
              ),
          },
          {
            key: "Action",
            title: "Action",
            align: "center",
            render: (text, record, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(record, index)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(record, index)}
                />
              </Space>
            ),
          },
        ]}
      />

      {/* <Table
        className="ant-table" // Ensures it uses the overridden styles
        dataSource={list}
        columns={[
          {
            key: "No",
            title: "No",
            render: (text, record, index) => (
              <div
                style={{
                  backgroundColor: "var(--table-row-bg)", // Dynamic background
                  color: "var(--table-row-text)",         // Dynamic text color
                }}
              >
                {index + 1}
              </div>
            ),
            
          },
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (status) =>
              status ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
          },
          {
            key: "Action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(data, index)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                />
              </Space>
            ),
          },
        ]}
        
      /> */}

      {/* <Table
        className="ant-table" // Ensures it uses the overridden styles
        dataSource={list}
          // style={{
          //   backgroundColor: "var(--modal-bg-color)",
          //   color: "var(--text-color)",
          // }}
        columns={[
          {
            key: "No",
            title: "No",
            render: (item, data, index) => index + 1,
          },
          {
            key: "name",
            title: "name",
            dataIndex: "name",
          },
          {
            key: "description",
            title: "description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "status",
            dataIndex: "status",
            render: (status) => (status? <Tag color="green">Active</Tag> :  <Tag color="red">InActive</Tag>),
          },
          {
            key: "Action",
            title: "Action",
            align: "center",
            render: (item, data, index) => (
              <Space>
                <Button
                  type="primary"
                  icon={<MdEdit />}
                  onClick={() => onClickEdit(data, index)}
                />
                <Button
                  type="primary"
                  danger
                  icon={<MdDelete />}
                  onClick={() => onClickDelete(data, index)}
                />
              </Space>
            ),
          },
        ]}
      /> */}
    </MainPage>
  );
}

export default CategoryPage;
