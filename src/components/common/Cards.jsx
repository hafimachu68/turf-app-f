import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardImage,
  MDBRipple
} from 'mdb-react-ui-kit';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import './cards.css'; // Import custom CSS file for styling


export default function Cards({court}) {
  const navigate=useNavigate()
  return (
    <MDBCard style={{width:'19rem'}} className='col-12 col-md-4 col-lg-4 col-xl-2 col-xxl-1 cd' onClick={()=>navigate(`/courtUserViewPage/${court._id}`)}  >
      <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
        <MDBCardImage src={`${BASE_URL}/courts/${court.courtPic}`} fluid alt='...' 
         style={{ maxWidth: '100%', height: '200px', display: 'block', margin: '0 auto', padding:'5px' }} />
      </MDBRipple>
      <MDBCardBody className='car'>
        <MDBCardTitle className='text-center'><u>{court?.courtName}</u></MDBCardTitle>
        <MDBCardSubTitle className='text-center'><b> Type:</b> {court?.type}</MDBCardSubTitle>
        <MDBCardSubTitle className='text-center'> <b>location :</b> {court?.location}</MDBCardSubTitle>
       <MDBCardText className='text-center p-1'>
        {court.about}
        </MDBCardText>
        <button className='w-100 mb-4 btn border text-light rounded-2'  style={{background: '  #010203'}}  >Book Now</button>
      </MDBCardBody>
    </MDBCard>
  );
}