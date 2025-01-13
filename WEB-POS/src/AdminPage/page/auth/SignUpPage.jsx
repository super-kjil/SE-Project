import React from "react";
import { Form, Button, message, Input } from "antd";
import { request } from "../../../util/helper";
import { setAcccessToken, setProfile } from "../../../store/profile.store";
import { Link, useNavigate } from "react-router-dom";
function SignUpPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onLogin = async (item) => {
    var param = {
      username: item.username,
      password: item.password,
    };
    const res = await request("auth/login", "post", param);
    if (res && !res.error) {
      setAcccessToken(res.access_token);
      setProfile(JSON.stringify(res.profile));
      navigate("/dashboard");
    } else {
      alert(JSON.stringify(res));
    }
  };
  return (
    <div
      className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      style={{ color: "var(--text-color)" }} // Dynamic text color
    >
      <h2
        className="mt-10 text-center text-2xl font-bold tracking-tight"
        style={{ color: "var(--text-color)" }} // Dynamic text color
      >
        Register new account
      </h2>

      <div
        className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm"
        style={{
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
        }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onLogin}
          className="space-y-6"
        >
          <Form.Item
            name="username"
            label={<span style={{ color: "var(--text-color)" }}>Username</span>}
            rules={[{ required: true, message: "Input your username" }]}
          >
            <Input
              placeholder="Username"
              style={{ color: "var(--text-color)" }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ color: "var(--text-color)" }}>Password</span>}
            rules={[{ required: true, message: "Input your password" }]}
          >
            <Input.Password
              placeholder="Password"
              style={{ color: "var(--text-color)" }}
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label={
              <span style={{ color: "var(--text-color)" }}>
                Confirm Password
              </span>
            }
            rules={[{ required: true, message: "Input your confirm password" }]}
          >
            <Input.Password
              placeholder="Confirm Password"
              style={{ color: "var(--text-color)" }}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            // style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}
          >
            Register
          </Button>
        </Form>
        <p className="mt-5 text-center text-sm">
          Already have an account?{" "}
          <Button type="link">
            <Link to="/login">Login</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
