import React from 'react'
import './nobooking.css'; // Import your custom CSS file
import nobook from '../images/nobooking.jpeg'; // Import your logo image




function Nobooking() {
  return (
    <div className='container-fluid nbg' >
        <div className="container text-center">
        <img
            src={nobook}
            alt="Your logo"
            className="n-img" // Apply custom CSS class if needed
          /> 
        </div>
    </div>
  )
}

export default Nobooking