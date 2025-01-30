import { Button, Drawer, Form, Input, Space, Upload } from "antd";
import React, { useState } from "react";
import User from "../assets/image/logo/image-profile.jpg";

function ProfileSetting() {
  const [form] = Form.useForm();
  // const refPage = React.useRef(1);
  // useEffect(() => {
  //   // handleCalSummary();
  //   loadCart();
  //   getList();
  // }, [filter]);

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
  //   Drawer component

  return (
    // <Drawer
    //   footer={"Footer"}
    //   title="Profile Setting"
    //   size="large"
    //   onClose={onClose}
    //   open={open}
    // >
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <div className="flex justify-center">
        <img
          className="w-20 h-1/2 rounded-full cursor-pointer "
          // src={
          //   customerProfile.image
          //     ? Config.image_path + customerProfile.image
          //     : { User }
          // }
          src={User}
          alt="User"
        />
      </div>
      <div className="flex justify-center mt-3">
        <Form.Item
          name={"image_default"}
          // label="Image"
        >
          <Upload
            customRequest={(options) => {
              options.onSuccess();
            }}
            maxCount={1}
            // listType="picture-circle"
            fileList={imageDefault}
            onPreview={handlePreview}
            onChange={handleChangeImageDefault}
          >
            {/* <div>+ Upload</div> */}
            <Button>Chose Photo</Button>
          </Upload>
        </Form.Item>
      </div>

      <Form.Item
        name={"name"}
        // label="Name"
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
        // label="Email"
        rules={[
          {
            required: true,
            message: "Please fill in email",
          },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name={"password"}
        // label="password"
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
        name={"confirm_password"}
        // label="Confirm Password"
        rules={[
          {
            required: true,
            message: "Please fill in confirm password",
          },
        ]}
      >
        <Input.Password placeholder="Confirm password" />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Space>
          {/* <Button onClick={onClose}>Cancel</Button> */}
          <Button type="primary" htmlType="submit">
            {form.getFieldValue("id") ? "Update" : "Save"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
    // </Drawer>
  );
}

export default ProfileSetting;
