import React, { useState } from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox, Card, notification } from "antd";
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
    console.log("values", values);
    const { userName, email, password, image } = values;
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("file", selectedFile);

      const { data } = await axios.post(
        "http://localhost:4000/users",
        formData
      );
      console.log("data ", data);
      if (data.success) {
        notification.success({
          message: "User registered successfully!",
          style: { height: 75 },
        });
      } else {
        notification.error("Failed to register user");
      }
      // history.push("/");
    } catch (error) {
      notification.error("Failed to register user");
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const onChangeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
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
