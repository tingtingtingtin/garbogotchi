import React, { useRef, useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "YOUR_MODEL_URL_HERE/"; // <-- Add trailing slash

type Prediction = {
  className: string;
  probability: number;
};

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;
const MODEL_INPUT_SIZE = 224; // Teachable Machine default, adjust if needed

const ModelVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

  // Load the Teachable Machine model and start webcam
  useEffect(() => {
    let isMounted = true;
    const setup = async () => {
      const loadedModel = await tmImage.load(
        `${MODEL_URL}model.json`,
        `${MODEL_URL}metadata.json`
      );
      if (isMounted) setModel(loadedModel);

      // Get webcam stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      } catch (err) {
        alert("Failed to access webcam: " + (err as Error).message);
      }
    };

    setup();
    return () => {
      isMounted = false;
      // Stop webcam stream if component unmounts
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  // Predict loop
  useEffect(() => {
    let animationFrameId: number;

    const predict = async () => {
      if (
        model &&
        videoRef.current &&
        canvasRef.current &&
        videoRef.current.readyState === 4
      ) {
        // Draw current video frame to canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
          // Run prediction on the canvas element
          const preds = await model.predict(canvas);
          setPredictions(preds as Prediction[]);
        }
      }
      // Throttle to ~20 FPS
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(predict);
      }, 50);
    };

    if (model && isCameraOn) {
      predict();
    }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [model, isCameraOn]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        style={{ border: "1px solid #ccc" }}
      />
      {/* Hidden canvas for prediction */}
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
    </div>
  );
};

export default ModelVideo;
