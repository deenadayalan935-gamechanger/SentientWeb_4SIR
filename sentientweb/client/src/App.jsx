import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSocket from './hooks/useSocket.js';
import TacticalMap from './components/Map/TacticalMap.jsx';
import AlertPanel from './components/AlertPanel/AlertPanel.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function StatusDot({ active, color }) {
  return (
    <motion.div
      animate={{ opacity: active ? [1, 0.3, 1] : 1 }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        backgroundColor: active ? color : '#4a7fa5',
        boxShadow: active ? '0 0 6px ' + color : 'none',
        display: 'inline-block',
        marginRight: '5px'
      }}
    />
  );
}

function Dashboard() {
  const { telemetry, connected, alerts, redAlert } = useSocket();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (redAlert) {
      document.body.classList.add('red-alert');
    } else {
      document.body.classList.remove('red-alert');
    }
  }, [redAlert]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: redAlert ? '#1a0000' : '#050a0e',
      fontFamily: 'Courier New, monospace',
      color: '#e0f4ff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'background-color 0.5s'
    }}>

      {/* Animated Background Grid */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: redAlert
            ? 'rgba(42,0,0,0.95)'
            : 'rgba(10,22,40,0.95)',
          borderBottom: '1px solid ' + (redAlert ? '#ff2222' : '#1a3a5c'),
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        {/* Left — Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid #00d4ff',
              borderTop: '2px solid transparent',
              borderRadius: '50%'
            }}
          />
          <div>
            <h1 style={{
              color: redAlert ? '#ff2222' : '#00d4ff',
              fontSize: '1rem',
              margin: 0,
              letterSpacing: '3px',
              fontWeight: 'bold'
            }}>
              SENTIENTWEB
            </h1>
            <p style={{
              color: '#4a7fa5',
              fontSize: '0.6rem',
              margin: 0,
              letterSpacing: '2px'
            }}>
              C4ISR TACTICAL DASHBOARD
            </p>
          </div>
          <AnimatePresence>
            {redAlert && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [1, 0.4, 1], scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{
                  color: '#ff2222',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  letterSpacing: '2px',
                  padding: '3px 10px',
                  border: '1px solid #ff2222',
                  borderRadius: '4px'
                }}
              >
                ⚠ RED ALERT
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Status Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          fontSize: '0.68rem'
        }}>
          {/* User */}
          <div style={{
            color: '#4a7fa5',
            padding: '3px 10px',
            border: '1px solid #1a3a5c',
            borderRadius: '4px',
            backgroundColor: 'rgba(10,22,40,0.8)'
          }}>
            <span style={{ color: '#00d4ff' }}>{user.role.toUpperCase()}</span>
            <span style={{ color: '#4a7fa5' }}> / </span>
            <span style={{ color: '#e0f4ff' }}>{user.username}</span>
          </div>

          {/* Status indicators */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span>
              <StatusDot active={connected} color="#00ff88" />
              <span style={{ color: connected ? '#00ff88' : '#ff2222' }}>
                {connected ? 'LIVE' : 'OFFLINE'}
              </span>
            </span>
            <span>
              <StatusDot active={true} color="#00d4ff" />
              <span style={{ color: '#00d4ff' }}>AI</span>
            </span>
            <span>
              <StatusDot active={true} color="#00ff88" />
              <span style={{ color: '#00ff88' }}>DB</span>
            </span>
          </div>

          {/* Threat counter */}
          <motion.div
            key={alerts.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{
              backgroundColor: alerts.length > 0 ? '#ff2222' : '#1a3a5c',
              color: '#fff',
              padding: '3px 12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '0.72rem',
              boxShadow: alerts.length > 0
                ? '0 0 10px rgba(255,34,34,0.4)'
                : 'none'
            }}
          >
            {alerts.length} THREATS
          </motion.div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #1a3a5c',
              color: '#4a7fa5',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'Courier New',
              fontSize: '0.65rem',
              letterSpacing: '1px'
            }}
          >
            LOGOUT
          </motion.button>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>

        {/* Map Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ flex: 2, position: 'relative' }}
        >
          <TacticalMap telemetry={telemetry} alerts={alerts} />
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid ' + (redAlert ? '#ff2222' : '#1a3a5c'),
            overflow: 'hidden',
            backgroundColor: 'rgba(8,15,24,0.92)',
            backdropFilter: 'blur(12px)'
          }}
        >

          {/* Alert Panel */}
          <div style={{
            flex: 1.2,
            borderBottom: '1px solid #1a3a5c',
            overflow: 'hidden'
          }}>
            <AlertPanel alerts={alerts} />
          </div>

          {/* Telemetry Feed */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px'
          }}>
            <div style={{
              padding: '4px 2px 8px 2px',
              borderBottom: '1px solid #1a3a5c',
              marginBottom: '8px',
              color: '#4a7fa5',
              fontSize: '0.68rem',
              letterSpacing: '2px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>LIVE TELEMETRY</span>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: '#00ff88', fontSize: '0.6rem' }}
              >
                ● STREAMING
              </motion.span>
            </div>

            <AnimatePresence>
              {telemetry.map((t, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{
                    backgroundColor: 'rgba(0,212,255,0.05)',
                    transition: { duration: 0.1 }
                  }}
                  style={{
                    backgroundColor: 'rgba(13,31,45,0.8)',
                    border: '1px solid #1a3a5c',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    marginBottom: '5px',
                    fontSize: '0.65rem',
                    cursor: 'default'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '3px'
                  }}>
                    <span style={{
                      color: '#00ff88',
                      fontWeight: 'bold',
                      letterSpacing: '1px'
                    }}>
                      [{t.unit_id}]
                    </span>
                    <span style={{
                      backgroundColor: 'rgba(0,212,255,0.1)',
                      color: '#00d4ff',
                      padding: '0px 5px',
                      borderRadius: '3px',
                      fontSize: '0.6rem',
                      border: '1px solid rgba(0,212,255,0.2)'
                    }}>
                      {t.unit_type}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#4a7fa5'
                  }}>
                    <span>{t.lat.toFixed(3)}, {t.lng.toFixed(3)}</span>
                    <span style={{ color: '#aaccdd' }}>
                      {t.speed} kmh
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginPage />;
}

export default App;