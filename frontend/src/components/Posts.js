import React, { useEffect, useState } from "react";
import axios from "axios";
import dotenv from "dotenv";

import { Avatar, Card, Col, message, Row } from "antd";
import AddPosts from "./AddPost";
const { Meta } = Card;

function Posts() {
  const [data, setData] = useState([]);

  const fetchPost = async () => {
    try {
      const token = localStorage.getItem("token") || "";
      console.log("token", token);

      const headers = {
        authorization: `Bearer ${token}`,
      };
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts`,
        {
          headers,
        }
      );
      console.log("data", data);
      setData(data);
    } catch (error) {
      console.log("Error - ", error);
      message.error("Please login to continue");
    }
  };
  useEffect(() => {
    fetchPost();
  }, []);

  const getPosts = () => {
    console.log("-----", data);
    return data.map((post) => {
      return (
        <>
          <Row>
            <Col span={8}></Col>
            <Col>
              <Card
                style={{
                  width: 600,
                  borderRadius: 15,
                  borderColor: "black",
                }}
                // cover={
                //   <img
                //     alt="example"
                //     src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                //   />
                // }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={post.userName}
                  description={post.description}
                />
              </Card>
            </Col>
          </Row>
          <br />
          <br />
        </>
      );
    });
  };

  return (
    <>
      <Row>
        <Col span={18}></Col>
        <AddPosts></AddPosts>
      </Row>
      <br />
      {getPosts()}
    </>
  );
}

export default Posts;
