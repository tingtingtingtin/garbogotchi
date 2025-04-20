import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import tamagotchiImage from './assets/tamagotchi.png'; // Replace with your Tamagotchi image
import ModelVideo from './components/ModelVideo';
import ErrorBoundary from './components/ErrorBoundary';
function App() {
    const [points, setPoints] = useState(0);
    const [level, setLevel] = useState(1);
    // Function to simulate increasing points (e.g., when trash is placed correctly)
    const incrementPoints = () => {
        setPoints(points + 10);
        if (points + 10 >= 100) {
            setLevel(level + 1);
            setPoints(0); // Reset points for the next level
        }
    };
    return (_jsxs("div", { className: "app-container", children: [_jsxs("div", { className: "header", children: [_jsx("h1", { className: "text-3xl", children: "Welcome to GarboGotchi!" }), _jsx("p", { children: "Help your Tamagotchi grow by sorting trash correctly!" })] }), _jsxs("div", { className: "tamagotchi-section", children: [_jsx("img", { src: tamagotchiImage, alt: "Tamagotchi", className: "tamagotchi-image" }), _jsxs("div", { className: "tamagotchi-stats", children: [_jsxs("p", { children: ["Level: ", level] }), _jsxs("p", { children: ["Points: ", points] })] })] }), _jsxs("div", { className: "instructions", children: [_jsx("p", { children: "Your Tamagotchi loves cleanliness! Place trash in the right bins to earn points." }), _jsx("p", { children: "Press the button below when you sort trash correctly!" })] }), _jsx("div", { className: "action-buttons", children: _jsx("button", { className: "sort-trash-button", onClick: incrementPoints, children: "Sort Trash Correctly!" }) }), _jsxs("div", { children: [_jsx("h1", { children: "Electron + React + Teachable Machine" }), _jsx(ErrorBoundary, { children: _jsx(ModelVideo, {}) })] }), _jsx("footer", { className: "footer", children: _jsx("p", { children: "GarboGotchi" }) })] }));
}
export default App;
