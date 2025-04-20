import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/yYg4YjF5G/";
const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;
const MODEL_INPUT_SIZE = 224;
const ModelVideo = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [predictions, setPredictions] = useState([]);
    const [model, setModel] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [error, setError] = useState(null);
    // Function to initialize the camera
    const setupCamera = async () => {
        console.log("Setting up camera...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log("Camera stream started");
            videoRef.current.srcObject = stream;
            setIsCameraOn(true);
            setError(null); // Clear any previous errors
        }
        catch (err) {
            console.error("Failed to access webcam:", err);
            setError("Failed to access webcam. Please allow camera permissions and try again.");
        }
        console.log("isCameraOn:", isCameraOn);
    };
    // Function to load the model
    const loadModel = async () => {
        try {
            const loadedModel = await tmImage.load(`${MODEL_URL}model.json`, `${MODEL_URL}metadata.json`);
            setModel(loadedModel);
        }
        catch (err) {
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
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);
    // Predict loop
    useEffect(() => {
        let animationFrameId;
        const predict = async () => {
            try {
                if (model &&
                    videoRef.current &&
                    canvasRef.current &&
                    videoRef.current.readyState === 4) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(videoRef.current, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
                        const preds = await model.predict(canvas);
                        setPredictions(preds);
                    }
                }
            }
            catch (err) {
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
    return (_jsxs("div", { children: [_jsxs(_Fragment, { children: [_jsx("video", { ref: videoRef, autoPlay: true, muted: true, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, style: { border: "1px solid #ccc", display: "block" } }), _jsx("canvas", { ref: canvasRef, width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE, style: { display: "none" } }), _jsx("h3", { children: "Predictions:" }), _jsx("ul", { children: predictions.map((p, i) => (_jsxs("li", { children: [p.className, ": ", (p.probability * 100).toFixed(2), "%"] }, i))) })] }), _jsxs("div", { children: [_jsx("p", { children: error || "Loading webcam or model..." }), _jsx("button", { onClick: setupCamera, children: "Retry Camera" })] })] }));
};
export default ModelVideo;
