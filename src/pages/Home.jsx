import React, { useEffect, useState } from 'react'
import NavScrollExample from '../components/common/Navbar'
import { Carousel } from 'react-bootstrap';
import Axiosinstance from '../config/Axiosinstances';
import Cards from '../components/common/Cards';
import { useNavigate } from 'react-router-dom';
import './css/hom.css'; // Import the custom CSS file
import { BASE_URL } from '../constants/constants';


function Home() {
const [courtData, setCourtData] = useState([])
const navigate= useNavigate()
useEffect(() => {
 getAllcourtsData()
}, []);
const getAllcourtsData=()=>{
  Axiosinstance.get('/users/getAllcourtsData').then((response)=>{
    setCourtData(response.data)

  })
  .catch(err=>{
    if (err.response.data.message==='unauthorized user')
    { localStorage.clear()
       navigate('/')
 }
  })
}





  return (
  <>
  <NavScrollExample />
      <div className="container-fluid p-b ">
        <Carousel>
          {courtData.map((court) => (
            <Carousel.Item key={court.id}>
              <img
                className="d-block w-100"
                src={`${BASE_URL}/courts/${court.courtPic}`} // Change this with your actual image URL
                alt={court.courtName}
              />
              <Carousel.Caption>
                <h3>{court.courtName}</h3>
                <p>{court.about}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="p-2 row gap-3">
          {courtData.map((court) => (
            <Cards court={court} key={court.id} />
          ))}
        </div>
      </div>
  </>
  )
}

export default Home