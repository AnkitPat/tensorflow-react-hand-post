import logo from './logo.svg';
import './App.css';
import { useCallback, useEffect, useRef } from 'react';
// import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
function App() {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runHandpose = async () => {
        console.log('Handpose model loaded');
        
        // Get access to webcam
        const video = videoRef.current;
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        
        // Make detections
        setInterval(() => {
            detect();
        }, 300);
    };
    runHandpose();
}, []);

  // useEffect(() => {
  //   if (videoRef) {
  //     if (navigator.mediaDevices.getUserMedia) {
  //       navigator.mediaDevices.getUserMedia({ video: true })
  //         .then(function (stream) {
  //           videoRef.current.srcObject = stream
  //         })
  //         .catch(function (err0r) {
  //           console.log("Something went wrong!");
  //         });
  //     }
  //   }
  // }, [videoRef]);

  const renderHandKeypoints = useCallback((predictions, ctx) => {
    // Check if predictions exist
    if (predictions?.length > 0) {
        // Loop through each prediction
        predictions.forEach((prediction) => {
            // Draw landmarks
            const landmarks = prediction.landmarks;
            if (landmarks?.length) {
              for (let i = 0; i < landmarks.length; i++) {
                  const x = landmarks[i][0];
                  const y = landmarks[i][1];
                  ctx.beginPath();
                  ctx.arc(x, y, 5, 0, 2 * Math.PI);
                  ctx.fillStyle = 'red';
                  ctx.fill();
              }
            }
        });
    }
}, []);

  // const startDetection = useCallback(async () => {
  //   const model = handPoseDetection.SupportedModels.MediaPipeHands;
  //   console.log('came here');
  //   const detectorConfig = {
  //     runtime: 'tfjs', // or 'tfjs'
  //     modelType: 'full'
  //   };
  //   console.log('came here1');

  //   let detector = await handPoseDetection.createDetector(model, detectorConfig);
  //   console.log(model, detector, videoRef?.current)
  //   const hands = await detector.estimateHands(videoRef?.current);
  //   console.log(hands);
  //   if (hands && hands.length > 0) {
  //     renderHandKeypoints(hands[0].landmarks, canvasRef?.current);
  //   }
  // }, [videoRef?.current, canvasRef?.current]);

  const detect = useCallback(async (net) => {
    if (videoRef?.current?.readyState === 4) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;

      canvas.width = videoWidth;
      canvas.height = videoHeight;

      const model = await handpose.load()
      const hand = await model.estimateHands(video);
      console.log(hand);
      renderHandKeypoints(hand, canvas.getContext('2d'))
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
       

       <div style={{display: 'flex', flexDirection: 'row'}}>
       <video style={{position: 'absolute', left: 0, top: 0}} ref={videoRef} autoPlay={true} />
        <canvas style={{position: 'absolute', left: 0, top: 0}} ref={canvasRef} />
       </div>

      </header>
    </div>
  );
}

export default App;
