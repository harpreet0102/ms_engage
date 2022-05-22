import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import * as canvas from "canvas";
import axios from "axios";

function DetectFace() {
  const videoRef = useRef(null);

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("../../models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("../../models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("../../models"),
      faceapi.nets.faceExpressionNet.loadFromUri("../../models"),
      faceapi.nets.ageGenderNet.loadFromUri("../../models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("../../models"),
    ]).then(
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: 720,
            height: 560,
          },
        })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("error:", err);
        })
    );
  }, [videoRef]);

  //   const loadModels = () => {
  //     console.log("here");
  //     Promise.all([
  //       faceapi.nets.tinyFaceDetector.loadFromUri("../models"),
  //       faceapi.nets.faceLandmark68Net.loadFromUri("../models"),
  //       faceapi.nets.faceRecognitionNet.loadFromUri("../models"),
  //       faceapi.nets.faceExpressionNet.loadFromUri("../models"),
  //       faceapi.nets.ageGenderNet.loadFromUri("../models"),
  //       faceapi.nets.ssdMobilenetv1.loadFromUri("../models"),
  //     ]).then(getVideo);
  //   };

  //   const getVideo = () => {
  //     navigator.mediaDevices
  //       .getUserMedia({
  //         video: {
  //           width: 720,
  //           height: 560,
  //         },
  //       })
  //       .then((stream) => {
  //         let video = videoRef.current;
  //         video.srcObject = stream;
  //         video.play();
  //       })
  //       .catch((err) => {
  //         console.error("error:", err);
  //       });
  //   };

  //   function timedRefresh(timeoutPeriod) {
  //     setTimeout("refreshLabels();", timeoutPeriod);
  //   }

  //   window.onload = timedRefresh(30000);

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
              "https://raw.githubusercontent.com/harpreet0102/ms_engage/main/frontend/src/labeled_images/hk/1.jpg?token=GHSAT0AAAAAABUXWPCK2MVWZZTBJDXRWGRGYUKQLPQ"
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

  const refreshLabels = async () => {
    // Refresh labels by checking username list from getLabels()
    // getLabels().then((data) => {
    //   dataS = JSON.stringify(data);
    //   sessionStorage.setItem("list", dataS);
    //   window.labels = JSON.parse(sessionStorage.getItem("list"));
    //   window.labeledFaceDescriptors = loadLabeledImages();
    // });
    const data = await getLabels();
    const labeledFaceDescriptors = loadLabeledImages();
  };

  const onPlayVideo = async () => {
    let video = videoRef.current;

    const canvas = await faceapi.createCanvas(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    const labeledFaceDescriptors = await loadLabeledImages();
    var faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.5);

    console.log("faceMatcher", faceMatcher);

    while (true) {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
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
        //   window.logName = results.map((a) => a.label).toString();
        //   try {
        //     postLog(logName);
        //   } catch {
        //     console.log("Unable to PostLog");
        //   }
      });
    }
  };

  //     while (true) {
  //       const detections = await faceapi
  //         .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
  //         .withFaceLandmarks()
  //         .withFaceExpressions()
  //         .withAgeAndGender()
  //         .withFaceDescriptors();
  //       const resizedDetections = faceapi.resizeResults(detections, displaySize);

  //       canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  //       faceapi.draw.drawDetections(canvas, resizedDetections);
  //       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  //       faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

  //       const results = resizedDetections.map((d) =>
  //         faceMatcher.findBestMatch(d.descriptor)
  //       );
  //       console.log("results", results, results[0]["_label"]);
  //       if (results.length > 0 && results[0]["_label"] != "unknown") {
  //         window.alert(results[0]["_label"]);
  //         return;
  //       }
  //       results.forEach((result, i) => {
  //         const box = resizedDetections[i].detection.box;
  //         const drawBox = new faceapi.draw.DrawBox(box, {
  //           label: result.toString(),
  //         });
  //         drawBox.draw(canvas);
  //         window.logName = results.map((a) => a.label).toString();
  //         try {
  //           //   postLog(logName);
  //         } catch {
  //           console.log("Unable to PostLog");
  //         }
  //       });
  //     }
  //   };

  return (
    <div>
      <div>
        <video
          onPlay={onPlayVideo}
          style={{ marginLeft: 600 }}
          ref={videoRef}
        />
      </div>
    </div>
  );
}

export default DetectFace;
