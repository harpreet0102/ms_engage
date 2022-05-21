import React, { useState } from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { black, blue, green } from "color-name";

function SignUpForm({ setShowLogin }) {
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
        title="SignUp!"
      >
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          style={{
            width: 500,
            marginLeft: 25,
          }}
        >
          <Form.Item
            name="firstname"
            rules={[
              {
                required: true,
                message: "Please input your Firstname",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="text"
              placeholder="Firstname"
            />
          </Form.Item>
          <Form.Item
            name="lastname"
            rules={[
              {
                required: true,
                message: "Please input your Lastname",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="text"
              placeholder="Lastname"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your EmailId",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              type="email"
              placeholder="Email Address"
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
              SignUp
            </Button>
            <br />
            <br />
            Already have an account ?{" "}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              onClick={(e) => setShowLogin(true)}
            >
              LogIn
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default SignUpForm;
