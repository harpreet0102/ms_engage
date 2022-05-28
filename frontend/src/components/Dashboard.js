import React, { useState, useEffect } from "react";
import dotenv from "dotenv";
import jwt_decode from "jwt-decode";
import axios from "axios";
import DetectFace2 from "./DetectFace2";
import Posts from "./Posts";
import { Button, Row, Col, message, Alert } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [recognisedFaceDetail, setRecognisedFaceDetail] = useState({
    faceRecognised: false,
    recognisedUserName: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = localStorage.getItem("token") || "";
    const headers = {
      authorization: `Bearer ${token}`,
    };
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/user`;
    const { data } = await axios.get(url, {
      headers,
    });

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
          <br />
          <br />
          <Alert
            message="Please refresh the page for the first time to load the models if you are not recognised"
            type="info"
            showIcon
          />
          <br />
          {user && user.role == "ADMIN" ? (
            <>
              <br />
              <br />
              <Alert
                message="Warning"
                description="Lot of people are misplaced in recent Assam flood. Use this tool for finding the missing person"
                type="warning"
                showIcon
                closable
              />
              <br />
              <br />
              <DetectFace2
                detectSignedInUser={false}
                setRecognisedFaceDetail={setRecognisedFaceDetail}
              ></DetectFace2>
              {recognisedFaceDetail.faceRecognised ? (
                <>
                  <img
                    src={`/labeled_images/${recognisedFaceDetail.recognisedUserName}/1.jpg`}
                    style={{ height: 300, width: 300, marginLeft: 200 }}
                  ></img>
                  <br />
                  <br />

                  <div style={{ height: 300, width: 300, marginLeft: 250 }}>
                    UserName: &nbsp; &nbsp;
                    <b>{recognisedFaceDetail.recognisedUserName}</b>
                  </div>
                  <br />
                  <br />
                  <br />
                </>
              ) : null}
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
