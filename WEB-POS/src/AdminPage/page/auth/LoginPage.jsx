import React from "react";
import { Form, Button, Input, Checkbox, Row, Col } from "antd";
import {
  setAcccessTokenCustomer,
  setCustomerProfile,
} from "../../../store/profile.store";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../../../util/helper";

function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onLogin = async (item) => {
    var param = {
      username: item.username, //"adminnit@gmail.com",///"sokdara@gmailcom",
      password: item.password,
    };
    const res = await request("customer/login", "post", param);
    if (res && !res.error) {
      setAcccessTokenCustomer(res.access_token);
      setCustomerProfile(JSON.stringify(res.customerProfile));
      navigate("/home");
    } else {
      alert(JSON.stringify(res));
    }
  };
  return (
    <Row>
      <Col
        xs={{
          flex: "0%",
        }}
        sm={{
          flex: "0%",
        }}
        md={{
          flex: "0%",
        }}
        lg={{
          flex: "0%",
        }}
        xl={{
          flex: "50%",
        }}
      >
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          {/* <img src={cambodia}/> */}
        </div>
      </Col>
      <Col
        xs={{
          flex: "100%",
        }}
        sm={{
          flex: "100%",
        }}
        md={{
          flex: "100%",
        }}
        lg={{
          flex: "100%",
        }}
        xl={{
          flex: "50%",
        }}
      >
        <div
          className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
          style={{ color: "var(--text-color)" }} // Dynamic text color
        >
          <h2
            className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
            style={{ color: "var(--text-color)" }} // Dynamic text color
          >
            Sign in to your account
          </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form
              layout="vertical"
              form={form}
              onFinish={onLogin}
              className="space-y-6"
            >
              <div>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[
                    {
                      required: true,
                      message: "Input your username",
                    },
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name="password"
                  label={
                    <span style={{ color: "var(--text-color)" }}>Password</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Input your password",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Checkbox style={{ color: "var(--text-color)" }}>
                    Remember me
                  </Checkbox>
                  <div className="text-sm">
                    <Button type="link">
                      <Link
                        to="/register"
                        className="font-semibold text-indigo-600 hover:text-indigo-500 px-0"
                      >
                        {" "}
                        Forgot Password?
                      </Link>
                    </Button>
                  </div>
                </div>

                <Button
                  type="primary"
                  htmlType="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  LOGIN
                </Button>
              </div>
            </Form>
            <p className="mt-5 text-center text-sm/6 text-gray-500">
              Don't have account ?{" "}
              <a className="font-semibold text-indigo-600 hover:text-indigo-500">
                <Button type="link">
                  <Link to="/signup"> Register </Link>
                </Button>
              </a>
            </p>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default LoginPage;
