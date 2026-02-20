import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function ExpertsList() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/experts', {
        params: { search, category, page }
      });
      setExperts(response.data.experts);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch experts", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [page, category]); // Fetch on page/category change. Search handled via button or debounce (simple: button)

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchExperts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Find an Expert</h1>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="input"
            style={{ marginBottom: 0, width: '200px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="input" 
            style={{ marginBottom: 0, width: '150px' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Psychology">Psychology</option>
            <option value="Career Coaching">Career Coaching</option>
            <option value="Nutrition">Nutrition</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <p>Loading experts...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {experts.map(expert => (
              <div key={expert._id} className="card">
                <h3>{expert.name}</h3>
                <p style={{ color: 'var(--primary-color)', fontWeight: 500 }}>{expert.category}</p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.5rem 0' }}>{expert.about}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <span>⭐ {expert.rating}</span>
                  <span>{expert.experience} exp</span>
                </div>
                <Link to={`/expert/${expert._id}`} className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>
                  View Availability
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span style={{ alignSelf: 'center' }}>Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpertsList;
