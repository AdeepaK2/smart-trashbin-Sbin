import React, { useEffect, useState, useRef } from 'react';
import Dustbin from './Dustbin';
import Status from './Status';
import './style.css';

const DustbinStatus = ({ dustbinHeight, latestDistance, setLatestDistance }) => {
    const [dustbinLevel, setDustbinLevel] = useState('N/A');
    const [motionDetected, setMotionDetected] = useState('N/A');
    const [orientation, setOrientation] = useState('N/A');
    const [deviceStatus, setDeviceStatus] = useState('Offline');
    const [fillLevel, setFillLevel] = useState(0);
    const [dustbinClass, setDustbinClass] = useState('');
    const [lastFetchTimeDisplay, setLastFetchTimeDisplay] = useState('N/A');
    const [isDataOld, setIsDataOld] = useState(false);
    const lastFetchTime = useRef(0);

    const apiKey = 'F34R5SSCZM1TKM1Q';
    const channelId = '2595804';
    const results = 1; // Only need the latest result

    const fetchData = async () => {
        try {
            const response = await fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`);
            const data = await response.json();

            if (data.feeds && data.feeds.length > 0) {
                const latestFeed = data.feeds[data.feeds.length - 1];
                const latestEntryTime = new Date(latestFeed.created_at).getTime();
                const currentTime = new Date().getTime();
                const timeDifference = currentTime - latestEntryTime;

                const twoMinutes = 2 * 60 * 1000;

                if (timeDifference <= twoMinutes) {
                    updateStatus(latestFeed);
                    lastFetchTime.current = currentTime;
                    setLastFetchTimeDisplay(new Date(currentTime).toLocaleString());
                    setDeviceStatus('Online');
                    setIsDataOld(false);
                } else {
                    setIsDataOld(true);
                    setDeviceStatus('Offline');
                    updateStatus(latestFeed);
                    setLastFetchTimeDisplay(new Date(latestEntryTime).toLocaleString());
                }
            } else {
                setDeviceStatus('Offline');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setDeviceStatus('Offline');
        }
    };

    const updateStatus = (feed) => {
        const orientation = parseInt(feed.field1);
        const motionDetected = parseInt(feed.field2);
        const distance = parseFloat(feed.field3);
        setLatestDistance(distance);
        const dustbinLevel = ((dustbinHeight - distance) / dustbinHeight * 100).toFixed(2);

        setDustbinLevel(`${dustbinLevel}%`);
        setMotionDetected(motionDetected ? 'Yes' : 'No');
        setOrientation(orientation ? 'Standing Correctly' : 'Flipped');

        setFillLevel(dustbinLevel);

        if (orientation === 0) {
            setDustbinClass('flipped');
        } else {
            if (dustbinLevel >= 95) {
                setDustbinClass('full');
            } else {
                setDustbinClass('standing');
            }
        }
    };

    useEffect(() => {
        fetchData();
        const fetchInterval = setInterval(fetchData, 15000); // Fetch data every 15 seconds

        return () => {
            clearInterval(fetchInterval);
        };
    }, [dustbinHeight]);

    return (
        <div className="container">
            <h1>Smart Trashbin</h1>
            {isDataOld && <div className="warning">Showing last seen data.</div>}
            <Dustbin dustbinClass={dustbinClass} fillLevel={fillLevel} />
            <Status label="Dustbin Level" value={dustbinLevel} />
            <Status label="Motion Detected" value={motionDetected} />
            <Status label="Orientation" value={orientation} />
            <Status label="Device Status" value={deviceStatus} />
            {isDataOld && <div className="last-seen">Last seen: {lastFetchTimeDisplay}</div>}
        </div>
    );
};

export default DustbinStatus;
