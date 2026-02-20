import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function ExpertDashboard() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch current expert's slots
    const fetchSlots = async () => {
        try {
            // We need a new endpoint for "my slots" or just filter the public one
            // For now, let's fetch the expert by ID (user._id)
            const { data } = await api.get(`/experts/${user._id}`);
            setSlots(data.slots || []);
        } catch (error) {
            console.error(error);
        }
    };
    if (user) fetchSlots();
  }, [user]);

  const addSlot = async (e) => {
    e.preventDefault();
    if (!date || !time) return;

    try {
        setLoading(true);
        // We need an endpoint to add slots. 
        // Let's assume POST /experts/slots
        await api.post('/experts/slots', { date, time });
        
        // Optimistic update or refetch
        setSlots([...slots, { date, time, isBooked: false }]);
        setDate('');
        setTime('');
    } catch (error) {
        alert("Failed to add slot");
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Expert Dashboard</h1>
      <p>Welcome, Dr. {user?.name}</p>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Add New Slot</h3>
        <form onSubmit={addSlot} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input" style={{ marginBottom: 0 }} />
          </div>
          <div>
            <label>Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input" style={{ marginBottom: 0 }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>Add Slot</button>
        </form>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Your Slots</h3>
        <div className="grid grid-cols-3 gap-4">
            {slots.map((slot, idx) => (
                <div key={idx} className="card" style={{ padding: '1rem', backgroundColor: slot.isBooked ? '#fee2e2' : '#d1fae5' }}>
                    <p><strong>{slot.date}</strong> at {slot.time}</p>
                    <p>{slot.isBooked ? 'Booked' : 'Available'}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ExpertDashboard;
