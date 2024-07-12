import React, { useState, useEffect } from 'react';
import './style.css';

const Settings = ({ setDustbinHeight, latestDistance }) => {
    const [inputHeight, setInputHeight] = useState('');

    useEffect(() => {
        if (latestDistance !== null) {
            setInputHeight(latestDistance);
        }
    }, [latestDistance]);

    const handleHeightChange = (e) => {
        setInputHeight(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const height = parseFloat(inputHeight);
        if (!isNaN(height) && height > 0) {
            setDustbinHeight(height);
        }
    };

    return (
        <div className="settings">
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Dustbin Height (cm): </label>
                    <input
                        type="number"
                        value={inputHeight}
                        onChange={handleHeightChange}
                        step="0.01"
                        min="0"
                    />
                </div>
                <button type="submit">Set Height</button>
            </form>
        </div>
    );
};

export default Settings;
