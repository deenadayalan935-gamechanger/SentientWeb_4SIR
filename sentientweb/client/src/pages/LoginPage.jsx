import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { loginUser, registerUser } from '../services/authService.js';

function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await registerUser(username, password, role);
        setIsRegister(false);
        setError('');
        alert('Account created! Please login.');
      } else {
        const data = await loginUser(username, password);
        if (data.success) {
          login(data.user, data.token);
        } else {
          setError(data.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error');
    }
    setLoading(false);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#050a0e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Courier New, monospace'
    }}>

      <div style={{
        backgroundColor: '#0a1628',
        border: '1px solid #1a3a5c',
        borderRadius: '8px',
        padding: '40px',
        width: '380px'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            color: '#00d4ff',
            fontSize: '1.6rem',
            letterSpacing: '4px',
            marginBottom: '6px'
          }}>
            SENTIENTWEB
          </h1>
          <p style={{ color: '#4a7fa5', fontSize: '0.75rem' }}>
            C4ISR TACTICAL DASHBOARD
          </p>
          <div style={{
            width: '60px',
            height: '1px',
            backgroundColor: '#1a3a5c',
            margin: '12px auto'
          }} />
          <p style={{ color: '#4a7fa5', fontSize: '0.7rem' }}>
            {isRegister ? 'CREATE ACCOUNT' : 'OPERATOR LOGIN'}
          </p>
        </div>

        {/* Username */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            color: '#4a7fa5',
            fontSize: '0.7rem',
            display: 'block',
            marginBottom: '6px'
          }}>
            USERNAME
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0d1f2d',
              border: '1px solid #1a3a5c',
              borderRadius: '4px',
              padding: '10px 12px',
              color: '#e0f4ff',
              fontFamily: 'Courier New',
              fontSize: '0.85rem',
              outline: 'none'
            }}
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            color: '#4a7fa5',
            fontSize: '0.7rem',
            display: 'block',
            marginBottom: '6px'
          }}>
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#0d1f2d',
              border: '1px solid #1a3a5c',
              borderRadius: '4px',
              padding: '10px 12px',
              color: '#e0f4ff',
              fontFamily: 'Courier New',
              fontSize: '0.85rem',
              outline: 'none'
            }}
            placeholder="Enter password"
          />
        </div>

        {/* Role selector — only on register */}
        {isRegister && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              color: '#4a7fa5',
              fontSize: '0.7rem',
              display: 'block',
              marginBottom: '6px'
            }}>
              ROLE
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#0d1f2d',
                border: '1px solid #1a3a5c',
                borderRadius: '4px',
                padding: '10px 12px',
                color: '#e0f4ff',
                fontFamily: 'Courier New',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="operator">Operator</option>
              <option value="commander">Commander</option>
            </select>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            color: '#ff2222',
            fontSize: '0.72rem',
            marginBottom: '12px',
            padding: '8px',
            backgroundColor: '#1a0000',
            borderRadius: '4px',
            border: '1px solid #ff2222'
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#1a3a5c' : '#00d4ff',
            color: '#050a0e',
            border: 'none',
            borderRadius: '4px',
            padding: '12px',
            fontFamily: 'Courier New',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '2px',
            marginBottom: '16px'
          }}
        >
          {loading ? 'PROCESSING...' : (isRegister ? 'CREATE ACCOUNT' : 'LOGIN')}
        </button>

        {/* Toggle */}
        <div style={{ textAlign: 'center' }}>
          <span
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              color: '#4a7fa5',
              fontSize: '0.72rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Already have an account? Login' : 'No account? Register here'}
          </span>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;