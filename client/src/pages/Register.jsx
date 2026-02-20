import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user', category: '', experience: '', about: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Basic validation for expert fields
    if (formData.role === 'expert' && (!formData.category || !formData.experience)) {
      setError("Please fill in category and experience for expert registration.");
      return;
    }
    
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem', marginBottom: '4rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ marginRight: '1rem' }}>Register as:</label>
            <select name="role" value={formData.role} onChange={handleChange} className="input" style={{ width: 'auto', display: 'inline-block' }}>
              <option value="user">User</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="input" minLength="6" required />

          {formData.role === 'expert' && (
            <>
              <label>Specialty Category <span style={{color: 'red'}}>*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} className="input" required>
                <option value="">Select Category</option>
                <option value="Psychology">Psychology</option>
                <option value="Career Coaching">Career Coaching</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Fitness">Fitness</option>
                <option value="Financial Planning">Financial Planning</option>
                <option value="Legal Advice">Legal Advice</option>
              </select>

              <label>Experience (e.g. '5 years') <span style={{color: 'red'}}>*</span></label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="input" required />

              <label>About/Bio</label>
              <textarea name="about" value={formData.about} onChange={handleChange} className="input" rows="3"></textarea>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
