import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function BookingForm() {
  const { expertId, date, time } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.phone) {
      setError("Please enter your phone number.");
      setLoading(false);
      return;
    }

    try {
      await api.post('/bookings', {
        expertId,
        userPhone: formData.phone,
        date,
        timeSlot: time,
        notes: formData.notes
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 2000); // Redirect after 2s
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Booking failed. Slot might be taken.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ color: 'var(--success)' }}>Booking Confirmed!</h2>
        <p>You will be redirected to your bookings shortly.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1>Confirm Booking</h1>
      <p style={{ marginBottom: '2rem' }}>Date: <b>{date}</b> Time: <b>{time}</b></p>
      
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <p style={{ marginBottom: '1rem' }}>
          <strong>Name:</strong> {user?.name} <br/>
          <strong>Email:</strong> {user?.email}
        </p>

        <label>Phone <span style={{ color: 'red' }}>*</span></label>
        <input 
          type="tel" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          className="input" 
          required 
        />

        <label>Notes (Optional)</label>
        <textarea 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange} 
          className="input" 
          rows="3"
        ></textarea>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }} 
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
