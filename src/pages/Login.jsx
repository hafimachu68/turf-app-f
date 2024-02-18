import React, { useState } from 'react'
import'./css/login.css'
import {
  
  MDBContainer,
  MDBRow,
  MDBCol}
from 'mdb-react-ui-kit';
import Loginbox from '../components/Loginbox';
import Signupbox from '../components/Signupbox';


function Login(){
 const [boxName, setBoxName] = useState('login')
 
  return (
    <div className='background-radial-gradient' style={{minHeight:'100%vh'}} >
    <MDBContainer fluid className='p-4 background-radial-gradient min-vh-100 overflow-hidden '>

      <MDBRow>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
        <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: '#EAE7B1', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'}}>
        "My Court" <br />
    <span style={{color: '#A6BB8D', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'}}>Step Onto Your Field of Dreams!</span>
</h1>

<p className='px-3' style={{color: '#010203', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'}}>
"Discover the ultimate convenience in sports turf booking. With just a few clicks, secure your spot, gather your team, and unleash your game. Your field, your rules, your victory. It's time to play!"

</p>




        </MDBCol>
         {boxName==='login' && <Loginbox setBoxName={setBoxName}/>}
         {boxName==='signup' && <Signupbox setBoxName={setBoxName} />}
         


        <MDBCol md='1'> </MDBCol>

      </MDBRow>

    </MDBContainer>
    </div>
  );
}

export default Login