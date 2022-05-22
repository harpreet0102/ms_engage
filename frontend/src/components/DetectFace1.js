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
      faceapi.nets.ageGenderNet.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ]).then(() => {
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
          // video.play();
          setIsLoaded(true);
          console.log("Video : " + video);
          addEvent();
        })
        .catch(function (e) {
          console.log(e.name + ": " + e.message);
        });

      const getLabels = async () => {
        var list = [];
        var labelList = new Array();
        const { data } = await axios.get("http://localhost:4000/users", {});
        data.forEach((user) => {
          labelList.push(user.userName);
        });
        console.log("labellist", labelList);

        return labelList;
      };

      const loadLabeledImages = async () => {
        // getLabels().then((data) => {
        //   dataS = JSON.stringify(data);
        //   sessionStorage.setItem("list", dataS);
        // });
        const labels = await getLabels();
        // const labels = JSON.parse(sessionStorage.getItem("list"));

        // Error handling for no users registered, hence labels is undefined, null or empty.
        // Define 'Sheldon' as default labels value.
        if (labels === undefined || labels === null || labels.length == 0) {
          window.labels = ["Sheldon"];
        }
        console.log("Labels - ", labels); // check that labels cannot be [] or empty at this point.

        return Promise.all(
          labels.map(async (label) => {
            var descriptions = [];
            for (let i = 1; i <= 1; i++) {
              try {
                const imageUrl = "labeled_images/" + `${label}/${i}.jpg`;
                // const img = await canvas.loadImage(
                //   `labeled_images/${label}/${i}.jpg`
                // );
                console.log(
                  "imageUrl",
                  "https://raw.githubusercontent.com/harpreet0102/ms_engage/main/frontend/src/labeled_images/hk/1.jpg?token=GHSAT0AAAAAABUXWPCK2MVWZZTBJDXRWGRGYUKQLPQ"
                );
                const img = await faceapi.fetchImage(
                  "https://raw.githubusercontent.com/harpreet0102/ms_engage/main/frontend/src/labeled_images/taran/1.jpg?token=GHSAT0AAAAAABUXWPCKTT2F7ZTWZOTRQY4MYUKVGUA"
                );
                console.log("------------------");
                const detections = await faceapi
                  .detectSingleFace(img)
                  .withFaceLandmarks()
                  .withFaceDescriptor();
                console.log("detections", detections);
                descriptions.push(detections.descriptor);
              } catch (err) {
                console.log("err here", err);
                // Do nothing or error handling
              }
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
          })
        );
      };

      function addEvent() {
        console.log("add event called");
        let video = document.getElementById("video");

        video.addEventListener("play", async () => {
          const canvas = await faceapi.createCanvasFromMedia(video);
          document.body.append(canvas);

          const displaySize = { width: video.width, height: video.height };
          faceapi.matchDimensions(canvas, displaySize);

          const labeledFaceDescriptors = await loadLabeledImages();
          var faceMatcher = new faceapi.FaceMatcher(
            labeledFaceDescriptors,
            0.5
          );

          console.log("faceMatcher", faceMatcher);

          while (true) {
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions()
              .withAgeAndGender()
              .withFaceDescriptors();
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

            const results = resizedDetections.map((d) =>
              faceMatcher.findBestMatch(d.descriptor)
            );
            console.log("results", results, results[0]["_label"]);
            if (results.length > 0 && results[0]["_label"] != "unknown") {
              window.alert(results[0]["_label"]);
              return;
            }
            results.forEach((result, i) => {
              const box = resizedDetections[i].detection.box;
              const drawBox = new faceapi.draw.DrawBox(box, {
                label: result.toString(),
              });
              drawBox.draw(canvas);
            });
          }
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
