/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import DetectFace from "./DetectFace";
import DetectFace2 from "./DetectFace2";
import Posts from "./Posts";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [faceRecognised, setFaceRecognised] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const token = localStorage.getItem("token") || "";
    console.log("token", token);
    const headers = {
      authorization: `Bearer ${token}`,
    };
    const url = "http://localhost:4000/user";
    const { data } = await axios.get(url, {
      headers,
    });

    console.log("-", data);

    setUser(data[0]);
  };

  return (
    <>
      <div className="site-card-wrapper">
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
    </>
  );
};

export default Dashboard;
