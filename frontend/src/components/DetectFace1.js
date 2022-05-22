import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import * as canvas from "canvas";
import WebCam from "react-webcam";

import axios from "axios";

function DetectFace1() {
  const [video, setVideo] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const height = 560;
  const width = 720;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load models on page load
  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      if (navigator.mediaDevices.getUserMedia) {
        setVideo(document.getElementById("video"));
        navigator.mediaDevices
          .getUserMedia({
            video: {
              width: 720,
              height: 560,
            },
          })
          .then(function (stream) {
            //Display the video stream in the video object
            let video = videoRef.current;
            console.log("video", video);

            video.srcObject = stream;
            //Play the video stream
            // video.autoPlay();
            setIsLoaded(true);
            console.log("Video : " + video);
            addEvent();
          })
          .catch(function (e) {
            console.log(e.name + ": " + e.message);
          });
      }

      function addEvent() {
        let video = document.getElementById("video");
        video.addEventListener("play", () => {
          console.log("addEvent");
          //const canvas = faceapi.createCanvasFromMedia(video.srcObject);
          const canvas = faceapi.createCanvas(video);
          //video.append(canvas);
          canvas.id = "canvas";
          document.querySelector("#video").append(canvas);
          document.body.append(canvas);
          const displaySize = { width: video.width, height: video.height };
          faceapi.matchDimensions(canvas, displaySize);
          setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();
            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            );
            canvas
              .getContext("2d")
              .clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          }, 100);
          console.log("Event added");
        });
      }

      console.log("models loaded");
    });
  }, []);

  console.log("Ready!");
  return (
    <div className="video-container">
      {/*<video
        id="video"
        //src={video}
        ref={videoRef}
        autoPlay={true}
        playsInline
        muted
        style={{ width: "720px", height: "560px" }}
      />*/}
      <WebCam
        id="video"
        //src={video}
        ref={videoRef}
        autoPlay={true}
        width={width}
        height={height}
        playsInline
        muted
        style={{ width: "720px", height: "560px" }}
      />
      <canvas
        id="canvas"
        ref={canvasRef}
        style={{ width: "720px", height: "560px" }}
      />
    </div>
  );
  //}
}

export default DetectFace1;
