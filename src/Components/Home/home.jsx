import React from "react";
import './home.scss';
import { Navigate, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className='home-container'>
            <div className='navbar-container'>
                <ul className='navbar-list'>
                    <li className='navbar-list-item'>Home</li>
                    <li className='navbar-list-item'>About Us</li>
                </ul>
            </div>
            <div className='title-container'>
                <p className='above-title'> Graduation Project</p>
                <h1 className='title'>Network Scanner</h1>
                <p className='sub-title'>Welcome to our revolutionizing Network Scanner Project. The project is a network scanner that identifies and analyzes devices on a local network. It scans IPs, retrieves MAC addresses, and detects open ports, providing detailed information such as the operating systems and vendors associated with the devices. The scanner aims to assist in network management and security assessments.</p>
            </div>
            <button className='start-button' onClick={() => navigate('/scanner')}>
                Start Scanning
            </button>
        </div>
    )
}

export default Home