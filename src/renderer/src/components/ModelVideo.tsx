import React, { useRef, useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";
// import { SerialPort } from "serialport";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/rcoM94M0f/";

type Prediction = {
  className: string;
  probability: number;
};

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;
const MODEL_INPUT_SIZE = 224;

const ClassEnum: { [key: string]: number } = {
  "Trash": 0,
  "Recycleable": 1,
  "Compost": 2,
};



const ModelVideo: React.FC<{ onPrediction: (prediction: number) => void }> = ({onPrediction,}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pastValueRef = useRef<number | null>(null);

  // Function to initialize the camera
  const setupCamera = async () => {
    console.log("Setting up camera...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Camera stream started");
        videoRef.current!.srcObject = stream;
        setIsCameraOn(true);
        setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to access webcam:", err);
      setError("Failed to access webcam. Please allow camera permissions and try again.");
    }
    console.log("isCameraOn:", isCameraOn);
  };
  // Function to load the model
  const loadModel = async () => {
    try {
      const loadedModel = await tmImage.load(
        `${MODEL_URL}model.json`,
        `${MODEL_URL}metadata.json`
      );
      setModel(loadedModel);
    } catch (err) {
      console.error("Error loading model:", err);
      setError("Failed to load the model. Please try again.");
    }
  };

  // Initial setup: Load model and initialize camera
  useEffect(() => {

    console.log("Loading model and setting up camera...");
    loadModel();
    setupCamera();

    return () => {
      // Stop webcam stream if component unmounts
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // Predict loop
  useEffect(() => {
    let animationFrameId: number;

    const predict = async () => {
      try {
        if (
          model &&
          videoRef.current &&
          canvasRef.current &&
          videoRef.current.readyState === 4
        ) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
            const preds = await model.predict(canvas);
            setPredictions(preds as Prediction[]);
            const bestPrediction = preds.reduce((prev, current) =>
              prev.probability > current.probability ? prev : current
            );

            //console.log("Best Prediction:", bestPrediction);

            // Map the class name to an enum value
            const enumValue = ClassEnum[bestPrediction.className];
            console.log("Mapped Enum Value:", enumValue);

            // Send the value to the Arduino
            if (enumValue !== undefined && enumValue !== pastValueRef.current) {
              window.electron.ipcRenderer.send('serial-write', enumValue);
              // console.log("Sent to Arduino:", enumValue);
            }
            onPrediction(pastValueRef.current ?? 0);
            pastValueRef.current = enumValue;
          }
        }
      } catch (err) {
        console.error("Error during prediction:", err);
      }
      animationFrameId = requestAnimationFrame(predict);
    };

    if (model && isCameraOn) {
      predict();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [model, isCameraOn]);

  return (
    <div className="hidden">
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            style={{ border: "1px solid #ccc",  display: "none" }}
          />
          <canvas
            ref={canvasRef}
            width={MODEL_INPUT_SIZE}
            height={MODEL_INPUT_SIZE}
            style={{ display: "none" }}
          />
          <h3>Predictions:</h3>
          <ul>
            {predictions.map((p, i) => (
              <li key={i}>
                {p.className}: {(p.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </>
        <div>
          <p>{error || "Loading webcam or model..."}</p>
          <button onClick={setupCamera}>Retry Camera</button>
        </div>
    </div>
  );
};

export default ModelVideo;