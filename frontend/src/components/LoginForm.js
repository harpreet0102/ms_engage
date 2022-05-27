import React, { useState } from "react";
import "antd/dist/antd.css";
import dotenv from "dotenv";

import { Form, Input, Button, Checkbox, Card, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { userName, password } = values;

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        {
          userName,
          password,
        }
      );

      if (data.success) {
        localStorage.setItem("token", data.accessToken);
        notification.success({
          message: "User loggedIn successfully!",
          style: { height: 60 },
        });
        navigate("/dashboard");
      } else {
        notification.error({
          message: "Failed to login user. Please register!",
          style: { height: 60, backgroundColor: "red" },
        });
      }
    } catch (error) {
      notification.error({
        message: "Failed to login user",
        style: { height: 60, backgroundColor: "red" },
      });
    }
  };
  return (
    <div className="site-card-wrapper">
      <Card
        hoverable
        style={{
          width: 600,
          marginLeft: 525,
          marginRight: 350,
          marginTop: 80,
          marginBottom: 200,
          height: 450,
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
            name="userName"
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
              style={{
                borderRadius: 5,
                //   background: "white",
                //   color: "olive",
                // borderColor: "black",
              }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
        <br />
        <br />
        Not Registered ? &nbsp;{" "}
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          style={{
            borderRadius: 5,
          }}
          onClick={() => navigate("/")}
        >
          Register
        </Button>
      </Card>
    </div>
  );
}

export default LoginForm;
