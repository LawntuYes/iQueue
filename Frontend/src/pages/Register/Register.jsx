import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user', // user, business, admin
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Backend validation regex:
    // min 8 chars, 1 number, 1 uppercase, 1 special char
    const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters long and contain at least one number, one uppercase letter.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(formData.name, formData.email, formData.password, formData.userType);
      // After register, navigate to home. AuthProvider persists the user and role.
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* כותרת */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-primary">i</span>
            <span className="logo-secondary">Queue</span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join iQueue to manage your appointments</p>
        </div>

        {/* טופס */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* הודעת שגיאה */}
          {error && (
            <div className="auth-error">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          {/* שדה שם */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          {/* שדה אימייל */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          {/* בחירת סוג משתמש */}
          <div className="form-group">
            <label className="form-label">
              I want to join as:
            </label>
            <div className="user-type-selector">
              {['user', 'business'].map((type) => (
                <label key={type} className="user-type-option">
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={formData.userType === type}
                    onChange={handleChange}
                    className="user-type-input"
                    disabled={isLoading}
                  />
                  <span className="user-type-label">
                    {type === 'user' ? 'Customer' : 'Business Owner'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* שדה סיסמה */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="At least 8 characters"
              required
              disabled={isLoading}
            />
          </div>

          {/* שדה אימות סיסמה */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>

          {/* כפתור הרשמה */}
          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* קישור להתחברות */}
          <div className="auth-footer">
            <p className="auth-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
            <Link to="/" className="back-link">
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;