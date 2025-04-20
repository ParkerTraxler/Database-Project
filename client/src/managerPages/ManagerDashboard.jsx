import React, { useState, useEffect } from 'react';
import ManagerNav from './ManagerNav'
import './ManagerDashboard.css';
import './ManagerNav.jsx';




const ManagerDashboard = () => {
  const images = [
    '/images/background-img3.jpg',
    '/images/background-img4.jpg',
    '/images/background-img5.jpg'
  ];




  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [fade, setFade] = useState(true);




  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % images.length);
        setFade(true);
      }, 7000);
    }, 7000);




    return () => clearInterval(interval);
  }, [nextImageIndex]);




  return (
    <div className="managerView-container">
      <div className="managerNav">
        <ManagerNav />
      </div>
      <div className="mainContentWrapper">
        <div
          className="bg-fade"
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
            opacity: fade ? 1 : 0
          }}
        />
        <div
          className="bg-fade"
          style={{
            backgroundImage: `url(${images[nextImageIndex]})`,
            opacity: fade ? 0 : 1
          }}
        />
        <div className="managerContent">
        </div>
      </div>
    </div>
  );
};




export default ManagerDashboard;
