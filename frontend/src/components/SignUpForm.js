import React, { useState } from "react";
import dotenv from "dotenv";

import "antd/dist/antd.css";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  notification,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { userName, email, password, image } = values;
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("file", selectedFile);

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users`,
        formData
      );
      if (data.success) {
        notification.success({
          message: "User registered successfully!",
          style: { height: 70 },
        });
        navigate("/login");
      } else {
        notification.error({
          message: `${data.message}. Please Login`,
          style: { height: 70 },
        });
        navigate("/login");
      }
    } catch (error) {
      notification.error({
        message: "Failed to login user",
        style: { height: 70 },
      });
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const onChangeHandler = (event) => {
    if (!event.target.files[0].type.includes("image")) {
      message.error("Please upload an image only!");
      return;
    }
    setShowSubmit(true);
    setSelectedFile(event.target.files[0]);
  };
  return (
    <div className="site-card-wrapper">
      <Card
        hoverable
        style={{
          width: 600,
          marginLeft: 525,
          marginRight: 350,
          marginTop: 75,
          marginBottom: 200,
          height: 490,
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
            name="userName"
            rules={[
              {
                required: true,
                message: "Please input your Username",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              type="text"
              placeholder="Username"
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
          <Form.Item
            name="file"
            rules={[
              {
                // required: true,
                message: "Please upload your Image!",
              },
            ]}
          >
            <Input
              prefix={<UploadOutlined className="site-form-item-icon" />}
              type="file"
              onChange={onChangeHandler}
              title="Please Upload your Image"
              placeholder="Image"
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
              disabled={!showSubmit}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              SignUp
            </Button>
          </Form.Item>
        </Form>
        {/* <br /> */}
        {/* <br /> */}
        Already have an account ?{" "}
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          onClick={(e) => navigate("/login")}
        >
          LogIn
        </Button>
      </Card>
    </div>
  );
}

export default SignUpForm;
