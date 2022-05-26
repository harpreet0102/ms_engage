import React, { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";

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
  const [recognisedFaceDetail, setRecognisedFaceDetail] = useState({
    faceRecognised: false,
    recognisedUserName: "",
  });
  // const [userDetail]

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
        `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
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
        type="primary"
        style={{
          borderRadius: 7,
        }}
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
            {recognisedFaceDetail.faceRecognised ? (
              <>
                <img
                  src={`/labeled_images/${recognisedFaceDetail.recognisedUserName}/1.jpg`}
                  style={{ height: 300, width: 300, marginLeft: 200 }}
                ></img>
                <br />
                <br />
                <br />
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
                setRecognisedFaceDetail={setRecognisedFaceDetail}
              ></DetectFace2>
            )}
          </Modal>
        </>
      ) : null}
    </>
  );
}

export default AddPosts;
