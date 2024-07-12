import React from 'react';
import './style.css';

const Status = ({ label, value }) => {
    return (
        <div className="status">
            {label}: <b>{value}</b>
        </div>
    );
};

export default Status;
