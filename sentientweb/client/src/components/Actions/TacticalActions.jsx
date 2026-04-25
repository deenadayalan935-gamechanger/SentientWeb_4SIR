import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Intercept Animation ──────────────────────────────────────
function InterceptAnimation({ onComplete }) {
  const [phase, setPhase] = useState(0);

  const phases = [
    { text: 'INTERCEPT ORDER CONFIRMED', color: '#ffaa00', duration: 800 },
    { text: 'CALCULATING TRAJECTORY...', color: '#ffaa00', duration: 1000 },
    { text: 'LAUNCHING INTERCEPTOR...', color: '#ff6600', duration: 1200 },
    { text: 'INTERCEPTOR AIRBORNE', color: '#ff6600', duration: 1000 },
    { text: 'TRACKING TARGET...', color: '#ff2222', duration: 1200 },
    { text: 'INTERCEPT IN PROGRESS', color: '#ff2222', duration: 1500 },
    { text: 'TARGET NEUTRALIZED', color: '#00ff88', duration: 2000 }
  ];

  useEffect(() => {
    if (phase < phases.length - 1) {
      const timer = setTimeout(() => setPhase(p => p + 1), phases[phase].duration);
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 2000);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        backgroundColor: 'rgba(5,10,14,0.97)',
        border: '1px solid ' + phases[phase].color,
        borderRadius: '12px',
        padding: '30px 40px',
        width: '420px',
        boxShadow: '0 0 40px ' + phases[phase].color + '44',
        backdropFilter: 'blur(20px)',
        textAlign: 'center'
      }}
    >
      {/* Animated radar circle */}
      <div style={{ position: 'relative', marginBottom: '20px', height: '80px' }}>
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '2px solid ' + phases[phase].color,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTop: '2px solid ' + phases[phase].color,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: phases[phase].color,
          fontSize: '1.2rem'
        }}>
          ▲
        </div>
      </div>

      {/* Phase progress */}
      <div style={{ marginBottom: '16px' }}>
        {phases.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: i <= phase ? 1 : 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px',
              fontSize: '0.65rem',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: i < phase ? '#00ff88' :
                               i === phase ? p.color : '#1a3a5c',
              boxShadow: i === phase ? '0 0 6px ' + p.color : 'none',
              flexShrink: 0
            }} />
            <span style={{
              color: i < phase ? '#00ff88' :
                     i === phase ? p.color : '#4a7fa5'
            }}>
              {p.text}
            </span>
            {i < phase && (
              <span style={{ color: '#00ff88', marginLeft: 'auto' }}>✓</span>
            )}
            {i === phase && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ color: p.color, marginLeft: 'auto' }}
              >
                ●
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#1a3a5c',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <motion.div
          animate={{ width: ((phase + 1) / phases.length * 100) + '%' }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            backgroundColor: phases[phase].color,
            borderRadius: '2px',
            boxShadow: '0 0 8px ' + phases[phase].color
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Neutralize Animation ─────────────────────────────────────
function NeutralizeAnimation({ targetId, onComplete }) {
  const [phase, setPhase] = useState(0);

  const phases = [
    { text: 'NEUTRALIZE ORDER RECEIVED', color: '#ff2222' },
    { text: 'AUTHORIZING STRIKE...', color: '#ff2222' },
    { text: 'STRIKE PACKAGE DEPLOYED', color: '#ff4444' },
    { text: 'IMPACT CONFIRMED', color: '#ff6600' },
    { text: 'TARGET ELIMINATED', color: '#00ff88' }
  ];

  useEffect(() => {
    const durations = [600, 1000, 1200, 1000, 2000];
    if (phase < phases.length - 1) {
      const t = setTimeout(() => setPhase(p => p + 1), durations[phase]);
      return () => clearTimeout(t);
    } else {
      setTimeout(onComplete, 2000);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        backgroundColor: 'rgba(26,0,0,0.97)',
        border: '1px solid #ff2222',
        borderRadius: '8px',
        padding: '16px 30px',
        minWidth: '360px',
        boxShadow: '0 0 30px rgba(255,34,34,0.4)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          style={{
            width: '10px', height: '10px',
            borderRadius: '50%', backgroundColor: '#ff2222',
            boxShadow: '0 0 10px #ff2222'
          }}
        />
        <span style={{
          color: '#ff2222', fontSize: '0.75rem',
          fontWeight: 'bold', letterSpacing: '2px'
        }}>
          NEUTRALIZE: {targetId}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{
            color: phases[phase].color,
            fontSize: '0.8rem',
            letterSpacing: '1px',
            marginBottom: '10px'
          }}
        >
          {phases[phase].text}
        </motion.div>
      </AnimatePresence>

      <div style={{
        width: '100%', height: '3px',
        backgroundColor: '#1a0000', borderRadius: '2px'
      }}>
        <motion.div
          animate={{ width: ((phase + 1) / phases.length * 100) + '%' }}
          style={{
            height: '100%', backgroundColor: '#ff2222',
            borderRadius: '2px', boxShadow: '0 0 6px #ff2222'
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Monitor Animation ────────────────────────────────────────
function MonitorAnimation({ targetId, onComplete }) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 400);
    setTimeout(onComplete, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'rgba(0,26,26,0.97)',
        border: '1px solid #00d4ff',
        borderRadius: '8px',
        padding: '14px 20px',
        width: '260px',
        boxShadow: '0 0 20px rgba(0,212,255,0.2)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center',
        gap: '8px', marginBottom: '8px'
      }}>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: '#00d4ff', boxShadow: '0 0 6px #00d4ff'
          }}
        />
        <span style={{
          color: '#00d4ff', fontSize: '0.7rem',
          fontWeight: 'bold', letterSpacing: '1px'
        }}>
          MONITORING ACTIVE
        </span>
      </div>
      <div style={{ color: '#4a7fa5', fontSize: '0.65rem', marginBottom: '6px' }}>
        Target: <span style={{ color: '#e0f4ff' }}>{targetId}</span>
      </div>
      <div style={{ color: '#00d4ff', fontSize: '0.68rem' }}>
        Surveillance feed established{'.'.repeat(dots)}
      </div>
      <div style={{
        marginTop: '8px', display: 'grid',
        gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.58rem'
      }}>
        {['RADAR LOCK', 'SAT FEED', 'DRONE CAM', 'SIGNAL INT'].map(s => (
          <motion.div
            key={s}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: Math.random() }}
            style={{
              backgroundColor: 'rgba(0,212,255,0.1)',
              border: '1px solid #00d4ff33',
              borderRadius: '3px', padding: '3px 6px',
              color: '#00d4ff'
            }}
          >
            ● {s}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── System Alert Overlay ─────────────────────────────────────
function SystemAlert({ message, color, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        backgroundColor: color + '11',
        border: '1px solid ' + color,
        borderRadius: '6px',
        padding: '8px 24px',
        fontSize: '0.72rem',
        color: color,
        letterSpacing: '2px',
        boxShadow: '0 0 16px ' + color + '44',
        backdropFilter: 'blur(8px)'
      }}
    >
      {message}
    </motion.div>
  );
}

export {
  InterceptAnimation,
  NeutralizeAnimation,
  MonitorAnimation,
  SystemAlert
};