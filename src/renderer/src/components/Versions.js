import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
function Versions() {
    const [versions] = useState(window.electron.process.versions);
    return (_jsxs("ul", { className: "versions", children: [_jsxs("li", { className: "electron-version", children: ["Electron v", versions.electron] }), _jsxs("li", { className: "chrome-version", children: ["Chromium v", versions.chrome] }), _jsxs("li", { className: "node-version", children: ["Node v", versions.node] })] }));
}
export default Versions;
