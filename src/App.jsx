import React, { useState } from 'react';
import DustbinStatus from './components/DustbinStatus.jsx';
import Settings from './components/Setting.jsx';
import './App.css';

const App = () => {
    const [showSettings, setShowSettings] = useState(false);
    const [dustbinHeight, setDustbinHeight] = useState(60); // Default height in cm
    const [latestDistance, setLatestDistance] = useState(null);

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    return (
        <div className="app-container">
            <button className="settings-icon" onClick={toggleSettings}>
                ⚙️
            </button>
            {showSettings && (
                <div className="settings-container">
                    <Settings setDustbinHeight={setDustbinHeight} latestDistance={latestDistance} />
                    <button onClick={toggleSettings} className="close-button">Close</button>
                </div>
            )}
            <DustbinStatus dustbinHeight={dustbinHeight} latestDistance={latestDistance} setLatestDistance={setLatestDistance} />
        </div>
    );
};

export default App;

