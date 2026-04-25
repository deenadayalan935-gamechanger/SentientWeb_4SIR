import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function StatusBar({ connected, alerts, user }) {
  const [time, setTime] = useState(new Date());
  const [latency, setLatency] = useState(38);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setLatency(Math.floor(Math.random() * 20) + 28);
      setUptime(function(u) { return u + 1; });
    }, 1000);
    return function() { clearInterval(timer); };
  }, []);

  function formatUptime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    var pad = function(n) { return String(n).padStart(2, '0'); };
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  var critical = alerts.filter(function(a) {
    return a.threatLevel === 'CRITICAL';
  }).length;

  var high = alerts.filter(function(a) {
    return a.threatLevel === 'HIGH';
  }).length;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      style={{
        backgroundColor: 'rgba(8,15,24,0.97)',
        borderTop: '1px solid #1a3a5c',
        padding: '4px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.6rem',
        color: '#4a7fa5',
        letterSpacing: '1px',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
        gap: '8px'
      }}
    >

      {/* Left Section */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <span>
          SYS:
          <span style={{ color: '#00ff88' }}> OPERATIONAL</span>
        </span>
        <span>
          LATENCY:
          <motion.span
            key={latency}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: latency < 50 ? '#00ff88' : '#ffaa00' }}
          >
            {' '}{latency}ms
          </motion.span>
        </span>
        <span>
          UPTIME:
          <span style={{ color: '#00d4ff' }}>
            {' '}{formatUptime(uptime)}
          </span>
        </span>
        <span>
          USER:
          <span style={{ color: '#00d4ff' }}>
            {' '}{user && user.username ? user.username.toUpperCase() : 'N/A'}
          </span>
        </span>
        <span>
          ROLE:
          <span style={{ color: '#aa44ff' }}>
            {' '}{user && user.role ? user.role.toUpperCase() : 'N/A'}
          </span>
        </span>
      </div>

      {/* Center Section */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: '#00ff88' }}
        >
          ● SIMULATION ACTIVE
        </motion.span>
        <span>
          TOTAL:
          <span style={{ color: '#ff6600' }}> {alerts.length}</span>
        </span>
        <span>
          CRITICAL:
          <motion.span
            key={critical}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{ color: critical > 0 ? '#ff2222' : '#4a7fa5' }}
          >
            {' '}{critical}
          </motion.span>
        </span>
        <span>
          HIGH:
          <span style={{ color: high > 0 ? '#ff6600' : '#4a7fa5' }}>
            {' '}{high}
          </span>
        </span>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: connected ? '#00ff88' : '#ff2222' }}
        >
          {connected ? '● WEBSOCKET LIVE' : '● DISCONNECTED'}
        </motion.span>
        <span>
          {time.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }).toUpperCase()}
        </span>
        <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>
          {time.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })}
        </span>
        <span>IST</span>
      </div>

    </motion.div>
  );
}

export default StatusBar;