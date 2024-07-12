import React from 'react';
import './style.css';

const Dustbin = ({ dustbinClass, fillLevel }) => {
    return (
        <div id="dustbin" className={`dustbin ${dustbinClass}`}>
            <div className="lid"></div>
            <div id="fill-level" className="fill-level" style={{ height: `${fillLevel}%` }}></div>
        </div>
    );
};

export default Dustbin;
