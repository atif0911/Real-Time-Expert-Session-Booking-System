import React, { useState } from 'react';
import api from '../services/api';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="container">
      <h1>My Bookings</h1>

      {loading && <p>Loading...</p>}

      {!loading && bookings.length === 0 && (
        <p>No bookings found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2">
        {bookings.map(booking => (
          <div key={booking._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0 }}>{booking.expertId?.name || 'Expert'}</h3>
              <span className={`badge`}>{booking.status}</span>
            </div>
            <p><strong>Date:</strong> {booking.date} at {booking.timeSlot}</p>
            <p><strong>Category:</strong> {booking.expertId?.category}</p>
            {booking.notes && <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}><em>Note: {booking.notes}</em></p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
