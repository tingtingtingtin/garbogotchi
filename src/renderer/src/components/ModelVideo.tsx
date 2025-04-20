import React, { useRef, useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";

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
  "Nothing": 3,
};

const ModelVideo: React.FC<{ onPrediction: (prediction: number) => void }> = ({ onPrediction }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pastValueRef = useRef<number | null>(null); // Track the last predicted value
  const lastValueRef = useRef<number | null>(null); // For debouncing the prediction
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer for debouncing prediction

  // Initialize the camera
  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current!.srcObject = stream;
      setIsCameraOn(true);
      setError(null);
    } catch (err) {
      console.error("Failed to access webcam:", err);
      setError("Failed to access webcam. Please allow camera permissions and try again.");
    }
  };

  // Load the model
  const loadModel = async () => {
    try {
      const loadedModel = await tmImage.load(`${MODEL_URL}model.json`, `${MODEL_URL}metadata.json`);
      setModel(loadedModel);
    } catch (err) {
      console.error("Error loading model:", err);
      setError("Failed to load the model. Please try again.");
    }
  };

  // Setup the camera and model on mount
  useEffect(() => {
    loadModel();
    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Prediction loop
  useEffect(() => {
    let animationFrameId: number;

    const predict = async () => {
      if (model && videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
          const preds = await model.predict(canvas);
          setPredictions(preds as Prediction[]);

          const bestPrediction = preds.reduce((prev, current) =>
            prev.probability > current.probability ? prev : current
          );

          const enumValue = ClassEnum[bestPrediction.className];

          // Debouncing prediction change
          if (enumValue !== undefined) {
            if (enumValue !== lastValueRef.current) {
              lastValueRef.current = enumValue;

              if (timerRef.current) {
                clearTimeout(timerRef.current);
              }

              // Start a new timer (debouncing)
              timerRef.current = setTimeout(() => {
                if (enumValue === lastValueRef.current) {
                  pastValueRef.current = enumValue; // Save the last sent value
                  onPrediction(enumValue); // Notify the parent component
                }
              }, 1500); // 500ms debounce time
            }
          }
        }
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
      <video ref={videoRef} autoPlay muted width={VIDEO_WIDTH} height={VIDEO_HEIGHT} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={MODEL_INPUT_SIZE} height={MODEL_INPUT_SIZE} style={{ display: "none" }} />
    </div>
  );
};

export default ModelVideo;
