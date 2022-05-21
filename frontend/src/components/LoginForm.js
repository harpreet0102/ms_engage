import React, { useState } from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

function LoginForm({ setShowLogin }) {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <div className="site-card-wrapper">
      <Card
        hoverable
        style={{
          width: 600,
          marginLeft: 550,
          marginRight: 350,
          marginTop: 125,
          marginBottom: 200,
          height: 480,
          borderRadius: 20,
        }}
        title="Login!"
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          style={{ width: 500 }}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <br />
            <br />
            Not Registered ? &nbsp;{" "}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              onClick={(e) => setShowLogin(false)}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default LoginForm;
