//import logo from './logo.svg';
import './App.css';
import React, {useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as facelandmarksdetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from './utilities';

function App() {
  //setting up the refrences
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Load the tfjs Face-landmarks-detection
  const runFacemesh = async () => {
    const net = await facelandmarksdetection.load(facelandmarksdetection.SupportedPackages.mediapipeFacemesh);
    setInterval(() => {
      detect(net)
    }, 100)
  };

  //Detect the face 
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState ===4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make detections
      const face = await net.estimateFaces({input:video});
      console.log(face);

      //Get canvas context for drawing
      const ctx = canvasRef.current.getContext("2d");
      drawMesh(face, ctx);
    }
  };
  
  runFacemesh();

  return (
    <div className="App">
      <header className="App-header">
      <Webcam ref={webcamRef} style={
        {  
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }
      } />

      <canvas ref={canvasRef} style={
        {  
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:640,
          height:480
        }
      } />
      </header>

    </div>
  );
}

export default App;
