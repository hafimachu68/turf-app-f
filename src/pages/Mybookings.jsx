import React from 'react'
import Mybooking from '../components/common/mybook'
import NavScrollExample from '../components/common/Navbar'
import '../components/common/nobooking.css'; // Import your custom CSS file


function Mybookings() {
    
     return (
      <>
      <div className='mbook'>
      <NavScrollExample/>
       <Mybooking/>
      </div>
      
        
      </>
  )
}

export default Mybookings