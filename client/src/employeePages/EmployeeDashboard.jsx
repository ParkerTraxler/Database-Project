import React, { useState, useEffect } from 'react';
import EmployeeNav from './EmployeeNav';
import './EmployeeDashboard.css';
import './EmployeeNav.css';




const EmployeeDashboard = () => {
  const images = [
    '/images/background-img.jpg',
    '/images/background-img1.jpg',
    '/images/background-img2.jpg'
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
      }, 500);
    }, 3000);




    return () => clearInterval(interval);
  }, [nextImageIndex]);




  return (
    <div className="employeeView-container">
      <div className="employeeNav">
        <EmployeeNav />
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
        <div className="employeeContent">
        </div>
      </div>
    </div>
  );
};




export default EmployeeDashboard;
