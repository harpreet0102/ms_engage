import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Button,
  Form,
  Input,
  Card,
  Col,
  Modal,
  Row,
  notification,
} from "antd";
import DetectFace2 from "./DetectFace2";
const { Meta } = Card;

function AddPosts() {
  const [description, setDescription] = useState("");
  const [openWebCam, setOpenWebcam] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [faceRecognised, setFaceRecognised] = useState(false);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const { description } = values;

    const token = localStorage.getItem("token") || "";
    console.log("token", token);
    const headers = {
      authorization: `Bearer ${token}`,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:4000/posts",
        { description },
        {
          headers,
        }
      );
      // navigate("/dashboard");

      if (data.success) {
        notification.success({
          message: "Post added successfully!",
          style: { height: 75 },
        });
      } else {
        notification.error("Failed to add post");
      }
    } catch (error) {
      notification.error("Failed to add post");
    }
  };

  const handleOk = () => {
    onFinish();
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button
        type="danger"
        // style={{
        //   color: "red",
        // }}
        onClick={() => setOpenModal(true)}
      >
        Add Post
      </Button>
      {openModal ? (
        <>
          <Modal
            width={800}
            visible={true}
            title="Add post"
            // onOk={handleOk}
            onCancel={handleCancel}
          >
            {faceRecognised ? (
              <>
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
                    name="description"
                    rules={[
                      {
                        required: true,
                        message: "Add post description!",
                      },
                    ]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Add Post
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <DetectFace2
                detectSignedInUser={true}
                setFaceRecognised={setFaceRecognised}
              ></DetectFace2>
            )}
          </Modal>
        </>
      ) : null}
    </>
  );
}

export default AddPosts;
