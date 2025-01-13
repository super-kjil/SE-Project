import React, { useEffect, useState } from "react";
import { request } from "../../../util/helper";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Upload,
} from "antd";
// import { resetWarned } from "antd/es/_util/warning";
import UserCard from "../../../component/user/UserCard";
function UserPage() {
  const [form] = Form.useForm();
  const [state, setState] = useState({
    list: [],
    role: [],
    loading: false,
    visible: false,
  });
  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const res = await request("auth/get-list", "get");
    if (res && !res.error) {
      setState((pre) => ({
        ...pre,
        list: res.list,
        role: res.role,
      }));
    }
  };

  const handleCloseModal = () => {
    setState((pre) => ({
      ...pre,
      visible: false,
    }));
    setImageDefault([]);
    form.resetFields();
  };

  const handleOpenModal = () => {
    setState((pre) => ({
      ...pre,
      visible: true,
    }));
  };
  const handleEdit = (item) => {
    form.setFieldsValue({
      ...item,
    });
    setState((pre) => ({ ...pre, visibleModal: true }));
    if (item.image != "" && item.image != null) {
      const imageProduct = [
        {
          uid: "-1",
          name: item.image,
          status: "done",
          url: "http://localhost/React_APP/" + item.image,
        },
      ];
      setImageDefault(imageProduct);
    }
    handleOpenModal();
  };

  const handleDelete = (item) => {
    Modal.confirm({
      title: "Delete User !",
      content: "Are you sure to Delete?",
      onOk: async () => {
        const res = await request("auth/remove-profile", "delete", {
          id: item.id,
        });
        if (res && !res.error) {
          message.success(res.message);
          const newList = state.list.filter((item1) => item1.id != item.id);
          setState((pre) => ({
            ...pre,
            list: newList,
          }));
        } else {
          message.warning(res.message);
        }
      },
    });
  };
  const onBtnNew = async () => {
    // const res = await request("new_barcode", "post");
    // if (res && !res.error) {
    //   form.setFieldValue("barcode", res.barcode);
    setState((p) => ({
      ...p,
      visible: true,
    }));
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

  // {"name":"a","username":"b","password":"12","role_id":2,"is_active":0}
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

  console.log(state.list);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            User
          </div>
          <Input.Search
            style={{ marginLeft: 10 }}
            placeholder="Search"
            size="midium"
          />
        </div>
        <Button type="primary" onClick={onBtnNew}>
          NEW
        </Button>
      </div>
      <Modal
        title={form.getFieldValue("id") ? "Update User" : "New User"}
        open={state.visible}
        onCancel={handleCloseModal}
        footer={null}
      >
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
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {form.getFieldValue("id") ? "Update" : "Save"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* <Table
        dataSource={state.list}
        columns={[
          {
            key: "no",
            title: "No",
            render: (value, data, index) => index + 1,
          },
          {
            key: "image",
            title: "image",
            dataIndex: "image",
            // render: (value) =>
            //   "http://localhost/React_APP/" + value,
            render: (value, data, index) =>
              value ? (
                <Image
                  src={"http://localhost/React_APP/" + value}
                  style={{ width: 40 }}
                />
              ) : (
                <div
                  style={{ backgroundColor: "#EEE", width: 40, height: 40 }}
                />
              ),
          },
          // {
          //   key: "image",
          //   title: "Image",
          //   dataIndex: "image",
          //   render: (value) => (
          //     value ? (
          //       <img
          //         src={`http://localhost/React_APP/${value}`}
          //         alt="User"
          //         style={{ width: 50, height: 50, objectFit: "cover" }}
          //       />
          //     )
          //     : (
          //       `http://localhost/React_APP/${value}`
          //     )
          //   ),
          // },

          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "username",
            title: "Username",
            dataIndex: "username",
          },
          {
            key: "role_name",
            title: "Role Name",
            dataIndex: "role_name",
          },
          {
            key: "is_active",
            title: "Status",
            dataIndex: "is_active",
            render: (value) =>
              value ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">In Active</Tag>
              ),
          },
          {
            key: "create_by",
            title: "Create By",
            dataIndex: "create_by",
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: (value, data) => (
              <Space>
                <Button onClick={() => handleEdit(data)} type="primary">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(data)}
                  danger
                  type="primary"
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]}
      /> */}
      {/* <UserCard/> */}
      <Row gutter={[4, 4]}>
        {state.list.map((item, index) => (
          <Col key={index} xs={12} sm={12} md={8} lg={6} xl={4} xxl={3}>
            <UserCard
              {...item}
              handleEdit={() => handleEdit(item)}
              handleDelete={() => handleDelete(item)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default UserPage;
