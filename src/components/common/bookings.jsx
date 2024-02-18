import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { BASE_URL } from '../../constants/constants';
import './booking.css';
import Axiosinstance from '../../config/Axiosinstances';
import { toastError,toastSucess } from '../../constants/Plugin';
import { useNavigate } from 'react-router-dom';

export default function List({ bookingData }) {
    const [fullDate, time] = bookingData.date.split('T');
    const [year, month, day] = fullDate.split('-');
     
    const navigate = useNavigate();

    const handleDelet = async () => {
      try {
        // Perform deletion action for booking
        await Axiosinstance.delete(`/payment/deleteSlot/${bookingData._id}`);
        toastSucess('Booking deleted successfully');
        // After deletion, you can update your UI as needed
        // For example, you can navigate to a different page or refresh the list of bookings
        navigate('/'); // Navigate to home page after successful deletion
      } catch (error) {
        toastError('Failed to delete booking');
        console.error(error); 
      } 
    };

    return (
        <Card className="cd-bg mt-4 mx-4 shadow-sm border">
            <Card.Img variant="top" src={`${BASE_URL}/courts/${bookingData.courtData.courtPic}`} alt="Court Image" />
            <Card.Body className='bd-bg text-center'>
                <Card.Title>{bookingData.courtData.courtName}</Card.Title>
                <Card.Text>
                    <strong>Time:</strong> {bookingData.slot.name}
                </Card.Text>
                <Card.Text>
                    <strong>Date:</strong> {day}/{month}/{year}
                </Card.Text>
                <Card.Text>
                    <strong>Location:</strong> {bookingData.courtData.location}
                </Card.Text>
                <Card.Text>
                    <strong>Address:</strong> {bookingData.courtData.address}
                </Card.Text>
                <Button variant="danger" onClick={handleDelet}>Delete</Button>
            </Card.Body>
        </Card>
    );
}
