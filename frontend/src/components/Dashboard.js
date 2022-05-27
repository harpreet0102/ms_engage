import React, { useState, useEffect } from "react";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";
import axios from "axios";
import DetectFace2 from "./DetectFace2";
import Posts from "./Posts";
import { Button, Row, Col, message } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [faceRecognised, setFaceRecognised] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = localStorage.getItem("token") || "";
    console.log("token", token);
    const headers = {
      authorization: `Bearer ${token}`,
    };
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/user`;
    const { data } = await axios.get(url, {
      headers,
    });

    console.log("-", data);

    setUser(data[0]);
  };

  return (
    <>
      {localStorage.getItem("token") ? (
        <div className="site-card-wrapper">
          <Button
            type="ghost"
            style={{ color: "black" }}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Log Out
          </Button>
          {user && user.role == "ADMIN" ? (
            <>
              <DetectFace2
                detectSignedInUser={false}
                setFaceRecognised={setFaceRecognised}
              ></DetectFace2>
            </>
          ) : null}
          <Posts></Posts>
        </div>
      ) : (
        <>
          <br />
          <br />
          {message.error("Please login to continue")}
          <Row>
            <Col span={12}></Col>
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log In
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default Dashboard;
