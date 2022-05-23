import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, Form, Input, Card, Col, Modal, Row } from "antd";
import DetectFace2 from "./DetectFace2";
const { Meta } = Card;

function AddPosts() {
  const [description, setDescription] = useState("");
  const [openWebCam, setOpenWebcam] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [faceRecognised, setFaceRecognised] = useState(false);

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    // const { userName, password } = values;

    // try {
    //   const { data } = await axios.post("http://localhost:4000/login", {
    //     userName,
    //     password,
    //   });
    //   // navigate("/dashboard");

    //   if (data.success) {
    //     notification.success({
    //       message: "User loggedIn successfully!",
    //       style: { height: 75 },
    //     });
    //     navigate("/dashboard");
    //   } else {
    //     notification.error("Failed to register user");
    //   }
    // } catch (error) {
    //   notification.error("Failed to register user");
    // }
  };

  const handleOk = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpenModal(true)}>
        Add Post
      </Button>
      {openModal ? (
        <>
          <Modal
            width={800}
            visible={true}
            title="Add post"
            onOk={handleOk}
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
                </Form>
              </>
            ) : (
              <DetectFace2 setFaceRecognised={setFaceRecognised}></DetectFace2>
            )}
          </Modal>
        </>
      ) : null}
    </>
  );
}

export default AddPosts;
