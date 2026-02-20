import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';

function ExpertDetail() {
  const { id } = useParams();
  const socket = useSocket();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const response = await api.get(`/experts/${id}`);
        setExpert(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expert", error);
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    const handleSlotUpdate = (data) => {
      if (data.expertId === id && expert) {
        setExpert(prev => {
          const updatedSlots = prev.slots.map(slot => {
            if (slot.date === data.date && slot.time === data.timeSlot) {
              return { ...slot, isBooked: data.isBooked };
            }
            return slot;
          });
          return { ...prev, slots: updatedSlots };
        });
      }
    };

    socket.on('slotUpdate', handleSlotUpdate);

    return () => {
      socket.off('slotUpdate', handleSlotUpdate);
    };
  }, [socket, id, expert]); // Dependency on expert might cause re-bind, but needed for state consistency

  if (loading) return <p>Loading...</p>;
  if (!expert) return <p>Expert not found</p>;

  // Group slots by date
  const slotsByDate = expert.slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1>{expert.name}</h1>
        <p className="text-secondary">{expert.category} • {expert.experience} Experience</p>
        <p style={{ marginTop: '1rem' }}>{expert.about}</p>
        <p style={{ marginTop: '0.5rem' }}>Rating: ⭐ {expert.rating}</p>
      </div>

      <h2>Available Sessions</h2>
      {Object.keys(slotsByDate).length === 0 ? (
        <p>No slots available.</p>
      ) : (
        Object.entries(slotsByDate).sort().map(([date, slots]) => (
          <div key={date} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>{date}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
              {slots.sort((a,b) => a.time.localeCompare(b.time)).map((slot, index) => (
                <Link
                  key={index}
                  to={slot.isBooked ? '#' : `/book/${expert._id}/${slot.date}/${slot.time}`}
                  className={`btn ${slot.isBooked ? 'btn-outline' : 'btn-primary'}`}
                  style={{ 
                    opacity: slot.isBooked ? 0.5 : 1, 
                    cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                    backgroundColor: slot.isBooked ? '#e5e7eb' : '',
                    borderColor: slot.isBooked ? '#d1d5db' : '',
                    color: slot.isBooked ? '#9ca3af' : ''
                  }}
                  onClick={e => slot.isBooked && e.preventDefault()}
                >
                  {slot.time} {slot.isBooked ? '(Booked)' : ''}
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ExpertDetail;
