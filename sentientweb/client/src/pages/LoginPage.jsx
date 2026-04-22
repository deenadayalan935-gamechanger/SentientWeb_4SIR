import { useState } from 'react';
import { motion } from 'framer-motion';
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

  const inputStyle = {
    width: '100%',
    backgroundColor: 'rgba(13,31,45,0.8)',
    border: '1px solid #1a3a5c',
    borderRadius: '4px',
    padding: '10px 12px',
    color: '#e0f4ff',
    fontFamily: 'Courier New',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#050a0e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Courier New, monospace',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background Grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Glowing orb */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          backgroundColor: 'rgba(10,22,40,0.92)',
          border: '1px solid #1a3a5c',
          borderRadius: '10px',
          padding: '40px',
          width: '380px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 40px rgba(0,212,255,0.08)',
          position: 'relative',
          zIndex: 1
        }}
      >

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{ textAlign: 'center', marginBottom: '30px' }}
        >
          {/* Spinning radar icon */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '36px',
                height: '36px',
                border: '2px solid #00d4ff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                boxShadow: '0 0 12px rgba(0,212,255,0.3)'
              }}
            />
          </div>

          <h1 style={{
            color: '#00d4ff',
            fontSize: '1.6rem',
            letterSpacing: '6px',
            marginBottom: '4px',
            textShadow: '0 0 20px rgba(0,212,255,0.4)'
          }}>
            SENTIENTWEB
          </h1>
          <p style={{ color: '#4a7fa5', fontSize: '0.65rem', letterSpacing: '3px' }}>
            C4ISR TACTICAL DASHBOARD
          </p>
          <div style={{
            width: '60px',
            height: '1px',
            backgroundColor: '#1a3a5c',
            margin: '12px auto'
          }} />
          <p style={{ color: '#4a7fa5', fontSize: '0.65rem', letterSpacing: '2px' }}>
            {isRegister ? 'CREATE ACCOUNT' : 'OPERATOR LOGIN'}
          </p>
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: '14px' }}
        >
          <label style={{
            color: '#4a7fa5',
            fontSize: '0.65rem',
            letterSpacing: '2px',
            display: 'block',
            marginBottom: '6px'
          }}>
            USERNAME
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
            placeholder="Enter username"
          />
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          style={{ marginBottom: '14px' }}
        >
          <label style={{
            color: '#4a7fa5',
            fontSize: '0.65rem',
            letterSpacing: '2px',
            display: 'block',
            marginBottom: '6px'
          }}>
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
            placeholder="Enter password"
          />
        </motion.div>

        {/* Role selector */}
        {isRegister && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginBottom: '14px' }}
          >
            <label style={{
              color: '#4a7fa5',
              fontSize: '0.65rem',
              letterSpacing: '2px',
              display: 'block',
              marginBottom: '6px'
            }}>
              ROLE
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                ...inputStyle,
                cursor: 'pointer'
              }}
            >
              <option value="operator">Operator</option>
              <option value="commander">Commander</option>
            </select>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              color: '#ff2222',
              fontSize: '0.68rem',
              marginBottom: '12px',
              padding: '8px 12px',
              backgroundColor: 'rgba(26,0,0,0.8)',
              borderRadius: '4px',
              border: '1px solid #ff2222'
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 20px rgba(0,212,255,0.4)'
          }}
          whileTap={{ scale: 0.97 }}
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
            letterSpacing: '3px',
            marginBottom: '16px',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'AUTHENTICATING...' : (isRegister ? 'CREATE ACCOUNT' : 'LOGIN')}
        </motion.button>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <span
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              color: '#4a7fa5',
              fontSize: '0.68rem',
              cursor: 'pointer',
              letterSpacing: '1px',
              textDecoration: 'underline',
              transition: 'color 0.2s'
            }}
          >
            {isRegister
              ? 'Already have an account? Login'
              : 'No account? Register here'}
          </span>
        </motion.div>

      </motion.div>
    </div>
  );
}

export default LoginPage;