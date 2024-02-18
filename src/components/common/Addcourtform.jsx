import React, { useState } from 'react';
import './addcourtform.css'; // Import your custom CSS file
import Axiosinstance from '../../config/Axiosinstances';
import { toastError, toastSucess } from '../../constants/Plugin';
import { useNavigate } from 'react-router-dom';

export default function Addcourtform() {
  const [formValue, setFormValue] = useState({
    courtName: '',
    location: '',
    type: '',
    address: '',
    about:'',
    description:''
  });

  const navigate = useNavigate();
  const [courtimage, setCourtimage] = useState(null);
  const [selectedimage, setSelectedimage] = useState('');

  const onChange = (e) => {
    setFormValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const addfileData = (e) => {
    setCourtimage(e.target.files[0]);
    e.target.files[0]
      ? setSelectedimage(URL?.createObjectURL(e.target.files[0]) ?? null)
      : setSelectedimage(null);
  };

  const addCourtdata = () => {
    let fileData = new FormData();
    fileData.append('image', courtimage);

    Axiosinstance.post('/admin/addCourtData', fileData, {
      params: formValue,
      Headers: { 'content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        toastSucess('Court Data added successfully');
        navigate('/home');
      })
      .catch((err) => {
        toastError('Invalid entry');
        if (err.response.data.message === 'unauthorized user') {
          localStorage.clear();
          navigate('/');
        }
      });
  };

  return (
    <div className="container-fluid s">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mg">
            <div className="card-body">
              <form>
                <div>
                  <h4 className='text-center fw-bold clr'> <u>Add Court Data</u></h4>
                </div>
                <div className="mb-3">
                  <label htmlFor="courtName" className="form-label clr">Court Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="courtName"
                    name="courtName"
                    value={formValue.courtName}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label clr">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formValue.location}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label clr">type</label>
                  <input
                    type="text"
                    className="form-control"
                    id="type"
                    name="type"
                    value={formValue.type}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="about" className="form-label clr">About</label>
                  <input
                    type="text"
                    className="form-control"
                    id="about"
                    name="about"
                    value={formValue.about}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label clr">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={formValue.description}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label clr">Addresss</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formValue.address}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="courtimage" className="form-label clr">Court Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="courtimage"
                    name="courtimage"
                    onChange={addfileData}
                    required
                  />
                </div>
                {selectedimage && (
                  <img
                    src={selectedimage}
                    alt="Selected Image"
                    className="img-fluid"
                  />
                )}
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input "  id="agreeTerms" required />
                  <label className="form-check-label clr"  htmlFor="agreeTerms">Agree to terms and conditions</label>
                </div>
                <div>
                <button type="submit" className="btn text-light" style={{background: '  #010203'}} onClick={addCourtdata}>Submit form</button>
                </div>
                <div className='mt-2'>
                <button type="reset" className="btn  text-light " style={{background:'#010203'}}>Reset form</button>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
