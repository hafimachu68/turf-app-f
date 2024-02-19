import React, { useEffect, useState } from 'react'
import './CoutBooking.css'
import { useNavigate, useParams } from 'react-router-dom';
import {
  MDBValidation,
  MDBValidationItem,
  MDBInput,
  MDBFile,
} from 'mdb-react-ui-kit';
import Axiosinstance from '../../config/Axiosinstances';
import { BASE_URL, TIMINGS } from '../../constants/constants';
import { ModalView } from './Modal';
import { toastError, toastSucess } from '../../constants/Plugin';
import { useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import optn from '../images/optn.png'; // Import your logo image








function CourtBooking() {

  const { id } = useParams();
  const [singleCourtData, setSingleCourtData] = useState({});
  const [modalOpen, setModalOpen] = useState();
  const [editModalOpen, setEditModalOpen] = useState(false);
 const [timeSlot, setTimeSlot] = useState({ startDate: '', endDate: '', cost: '' });
  const [showTimeSlot, setShowTimeSlot] = useState(false);
  const [selectedTiminigs, setSelectedTiminigs] = useState([]);
  const [filterTimings, setFilterTimings] = useState(TIMINGS)
  const [slotData, setSlotData] = useState([])
  const [inputDate, setInputDate] = useState()
  const [bookingModal, setBookingModal] = useState()
  const [selectedSlot, setSelectedSlot] = useState(null)
  const {userDetail}=useSelector(state=>state.user)
  const [editedCourtData, setEditedCourtData] = useState({
    courtName: '',
    location: '',
    type: '',
    address: '',
    about: '',
    description: '',
    image: null
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate=useNavigate()
 
  const handleInputChange = (e) => {
    if (e.target.name === 'image') {
      setEditedCourtData({ ...editedCourtData, [e.target.name]: e.target.files[0] });
    } else {
      setEditedCourtData({ ...editedCourtData, [e.target.name]: e.target.value });
    }
  };


  useEffect(() => {
    getSingleCourtData()
    handleToday()

  })

  useEffect(() => {

    getFilterTimeSlot()

  },[selectedTiminigs]);

  const getSingleCourtData = () => {
    Axiosinstance.get('/users/getSingleCourtData', { params: { courtId: id } }).then((res) => {
      setSingleCourtData(res.data)
    }).catch((err) => {
      if (err.response.data.message==='unauthorized user')
      { localStorage.clear()
         navigate('/')
   }
    });
  }
  const handleSaveEdit = () => {
    const formData = new FormData();
    formData.append('courtName', editedCourtData.courtName);
    formData.append('location', editedCourtData.location);
    formData.append('type', editedCourtData.type);
    formData.append('address', editedCourtData.address);
    formData.append('about', editedCourtData.about);
    formData.append('description', editedCourtData.description);
    formData.append('image', editedCourtData.image);

    Axiosinstance.put(`/admin/updateCourtData/${id}`, formData)
      .then((res) => {
      toastSucess('Court data updated successfully');
        setModalOpen(false);
      })
      .catch((err) => {
        toastError('Failed to update court data');
        console.log(err);
      });
  };
  const handleDelete = async () => {
    try {
      // Perform deletion action with itemIdToDelete   
      await Axiosinstance.delete(`/admin/deleteData/${id}`);
      toastSucess('Item deleted successfully');
      navigate('/');
    } catch (error) {
      toastError('Failed to delete item');
      console.error(error);
    } finally {
      setDeleteModalOpen(false);
    }
  };


  const removeSelectedTiming = (index) => {
    const updatedSelectedTiminigs = [...selectedTiminigs];
    updatedSelectedTiminigs.splice(index, 1);
    setSelectedTiminigs(updatedSelectedTiminigs);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
     setInputDate(today);
    getTimeSlotData(new Date()); // Fetch slots for today immediately
  };
  
  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    setInputDate(tomorrowDate);
    getTimeSlotData(tomorrowDate); // Fetch slots for tomorrow immediately
  };
  

  const handleSlot = (e) => {
    setTimeSlot({ ...timeSlot, [e.target.name]: e.target.value })
  };



  const getFilterTimeSlot = () => {
    if (selectedTiminigs.length === 0) {
      setFilterTimings(TIMINGS);

    } else {
      const tempArray = []
      for (let slot of TIMINGS) {
        let flag = false
        for (let sSlot of selectedTiminigs) {
          if (slot.id === sSlot.id) {
            flag = true
          }
        }

        if (!flag) {
          tempArray.push(slot)
        }
      }
      setFilterTimings(tempArray)
    }
  }

  const handleCreateSlot = () => {
    try {
      Axiosinstance.post('/admin/addTimeSlotData', { ...timeSlot, selectedTiminigs, courtId: id }).then((res) => {
        setModalOpen(false)
        toastSucess('court slots added sucessfully')

      })

    } catch (err) {
      toastError('something went wrong')
      console.log(err)
      if (err.response.data.message==='unauthorized user')
      { localStorage.clear()
         navigate('/')
   }
    }
  }

  const getTimeSlotData = (date = new Date()) => {
    Axiosinstance.get('/users/dayWiseTimeSlot', { params: { courtId: id, date: date } }).then((res) => {
      setSlotData(res.data)
      // console.log(res.data)
    }).catch((err) => {
      console.log(err);
      if (err.response.data.message==='unauthorized user')
      { localStorage.clear()
         navigate('/')
   }
    })
  }


  const intiateBooking = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await Axiosinstance.post("/payment/orders", { slotId: selectedSlot._id });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_z93Zp9rqzCo9bC", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "My Court.",
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          slotId: selectedSlot._id

        };

        const result = await Axiosinstance.post("/payment/success", data);
        toastSucess("slot booked successfully");
        setBookingModal(false)
        getTimeSlotData(new Date(inputDate))
      },
      prefill: {
        name: "Soumya Dey",
        email: "SoumyaDey@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Soumya Dey Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

   

  return (
    < >
      <div className='single-court-img-box '>
      <Dropdown className="dropdown-overlay">
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="">
          <img
            src={optn}
            alt="Your logo"
            className="d-inline-block align-top optn-img"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
        <Dropdown.Item onClick={() => setEditModalOpen(true)}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={() => setDeleteModalOpen(true)}>Delete</Dropdown.Item>

        </Dropdown.Menu>
      </Dropdown>
        <img src={`${BASE_URL}/courts/${singleCourtData?.courtPic}`} alt="court
    " />
        <div className='court-name'>
          <h3 style={{color: '  #010203'}} >{singleCourtData.courtName}</h3>
        { userDetail.role===1 &&  <button className='btn text-light border' style={{background: '  #010203'}}  onClick={() => setModalOpen(true)}>Add Time Slot</button>}
        </div>
      </div>
      <div className="d-flex">
        <marquee
          behaviour="scroll"
          direction="right"
          className="rolling booking">
          <h3>Confirm your slots at the earliest</h3>
        </marquee>
      </div>
      <div className="container-fluid slot-p">
        <div className="row justify-content-center">
          <div className="col-md-6  col-lg-3 col-12 border border-1 rouded-2 mt-4 slt">
          <div className="date-picker">
  <div className="buttons-right">
    <button className="btn rounded-2 text-light "style={{background: '  #010203'}} onClick={handleToday}>Today</button>
    <button className="btn rounded-2 text-light b-r "style={{background: '  #010203'}} onClick={handleTomorrow}>Tomorrow</button>
  </div>
  <div className="search-input">
    <input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} />
    <button className="btn text-light search-button b-r" onClick={() => inputDate && getTimeSlotData(new Date(inputDate))}>Search</button>
  </div>
</div>
            {/* <div className='slotname-container d-flex  flex-wrap gx-2 gap-3 mt-5 pointer'>
              {slotData.map((slot) => <span className={`border rounded-2 ${slot.bookedBy  ? 'bg-primary' : 'bg-warning'}`} key={slot.id} onClick={() => { !slot.bookedBy && setBookingModal(true); !slot.bookedBy && setSelectedSlot(slot) }}>{slot.slot.name}</span>)}
            </div> */}

     <div className='slotname-container d-flex flex-wrap gx-2 gap-3 mt-5 pointer'>
       {slotData.map((slot)=><span className={`border rounded-2 ${slot.bookedBy?'bg-primary':'bg-warning'}`} key={slot.id} onClick={()=>{!slot.bookedBy && setBookingModal(true); !slot.bookedBy && setSelectedSlot(slot)}}>{slot.slot.name}</span>)}
       </div>
          </div>
        </div>
      </div>

      <div>
        <ModalView modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <div className='modal-content' >
          <div>
            <span className="close-button" onClick={() => setModalOpen(false)}>
              &times;
            </span>
          </div>

            <form>
              <h2 className='text-center'>{singleCourtData.courtName}</h2>
              <h4 className='text-center'>{singleCourtData.location}</h4 >

              <div className='me-7'>
                <label htmlFor="startDate">Starting Date:</label>
                <input type="date" id="startDate" name="startDate" value={timeSlot.startDate} onChange={handleSlot} required />
              </div>


              <div>
                <label htmlFor="endDate">Ending Date:</label>
                <input type="date" id="endDate" min={timeSlot.startDate} name="endDate" value={timeSlot.endDate} onChange={handleSlot} required />
              </div>


              <div>
                <label htmlFor="cost">Cost:</label>
                <input type="number" id="cost" name="cost" value={timeSlot.cost} onChange={handleSlot} required />
              </div>
              <div className='cus-drop-down d-inline' style={{ background: '#010203' }} onClick={() => { setShowTimeSlot(true) }}>
                    Select Time Slot
                    {showTimeSlot && (
                      <div className='cus-option' onMouseLeave={() => { setShowTimeSlot(false) }}>
                        <ul>
                      {filterTimings.map((element, index) => (
                            <li key={index} onClick={() => setSelectedTiminigs([...selectedTiminigs, element])}>
                              {element.name}
                        </li>
                          ))}
                        </ul>
                      </div>
                               )}
              </div>
              <div className='m-2'>
  {selectedTiminigs?.length > 0 && selectedTiminigs.map((element, index) => (
    <div key={index} className='selected-time-slot'>
      <span>{element.name}</span>
      <span className="cloe-button" onClick={() => removeSelectedTiming(index)}>&times;</span>
    </div>
  ))}
</div>

            </form>
            <div className='p-3'>
            <button className='w-100 mb-4 btn border text-light rounded-2'  style={{background: '  #010203'}} type="submit" onClick={handleCreateSlot} >
                Save Time Slot
              </button>

            </div>
          </div>

        </ModalView>

         <ModalView modalOpen={bookingModal} setModalOpen={setBookingModal}>
         <div className="modal-content">
         <div>
            <span className="close-button" onClick={() => setBookingModal(false)}>
              &times;
            </span>
          </div>

          <div><h2 className='text-center'>{selectedSlot?.court?.courtName}</h2></div>
          <div > <strong>Date:</strong>{new Date(selectedSlot?.date).toString().slice(0, 16)}</div>
          <div> <strong>Slot:</strong>  {selectedSlot?.slot?.name}</div>
          <div><strong> Cost:</strong>  {selectedSlot?.cost}</div>
          <div><strong> Address:</strong> {selectedSlot?.court?.address}</div>
          <button className='w-100 mb-2 mt-3 btn border text-light rounded-2'  style={{background: '  #010203'}} type="submit" onClick={intiateBooking} >
            Book Now
          </button>

         </div>
         
        </ModalView>
        <ModalView modalOpen={editModalOpen} setModalOpen={setEditModalOpen}>
      <div className="modal-content ">
        <span className="close-button" onClick={() => setEditModalOpen(false)}>&times;</span>
        <h2 className='text-center'>Edit Court Data</h2>
        <MDBValidation>
          <MDBValidationItem>
            <MDBInput
              value={editedCourtData.courtName}
              name='courtName'
              onChange={handleInputChange}
              id='courtName'
              required
              label='Court Name'
            />
          </MDBValidationItem>
          <MDBValidationItem>
            <MDBInput
              value={editedCourtData.location}
              name='location'
              onChange={handleInputChange}
              id='location'
              required
              label='Location'
            />
          </MDBValidationItem>
          <MDBValidationItem>
            <MDBInput
              value={editedCourtData.type}
              name='type'
              onChange={handleInputChange}
              id='type'
              required
              label='Type'
            />
          </MDBValidationItem>
          <MDBValidationItem>
            <MDBInput
              value={editedCourtData.about}
              name='about'
              onChange={handleInputChange}
              id='about'
              type='text'
              required
              label='About'
            />
          </MDBValidationItem>
          <MDBValidationItem>
            <MDBInput
              value={editedCourtData.address}
              name='address'
              onChange={handleInputChange}
              id='address'
              type='text'
              required
              label='Address'
            />
          </MDBValidationItem>
          <MDBValidationItem>
            <MDBInput
              value={editedCourtData.description}
              name='description'
              onChange={handleInputChange}
              id='description'
              type='text'
              required
              label='Description'
            />
          </MDBValidationItem>
          <MDBValidationItem>
            <MDBFile
              name='image'
              onChange={handleInputChange}
              id='image'
              required
              label='Court Image'
            />
          </MDBValidationItem>
        </MDBValidation>
        <button className='w-100 mb-4 btn border text-light rounded-2'  style={{background: '  #010203'}} onClick={handleSaveEdit}>Save</button>
      </div>
    </ModalView>
    <ModalView   modalOpen={deleteModalOpen} setModalOpen={setDeleteModalOpen}>
      <div className="modal-content ">
        <span className="close-button" onClick={() => setDeleteModalOpen(false)}>
          &times;
        </span>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this item?</p>
        <button className='w-100 mb-4 btn border text-light rounded-2'  style={{background: '  #010203'}}onClick={handleDelete}>Confirm</button>
        <button className='w-100 mb-4 btn border text-light rounded-2'  style={{background: '  #010203'}}onClick={() => setDeleteModalOpen(false)}>Cancel</button>
      </div>
    </ModalView>

      </div>
    </>
  )
}

export default CourtBooking