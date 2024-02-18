import React, { useEffect, useState } from 'react';
import Axiosinstance from '../../config/Axiosinstances';
import List from './bookings';
import { useNavigate } from 'react-router-dom';
import Nobooking from './Nobooking';

function Mybooking() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMybookingsData();
  },[]);

  const getMybookingsData = () => {
    Axiosinstance.get('/users/getMybookingsData')
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.message === 'unauthorized user') {
          localStorage.clear();
          navigate('/');
        }
      });
  };

  return (
    <div>
      {bookings.length > 0 ? (
        bookings.map((booking) => <List bookingData={booking} />)
      ) : (
        <Nobooking/>
        /* You can replace this with any message or component you want to show when there are no bookings */
      )}
    </div>
  );
}

export default Mybooking;
