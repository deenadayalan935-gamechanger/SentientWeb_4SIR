import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSocket from './hooks/useSocket.js';
import TacticalMap from './components/Map/TacticalMap.jsx';
import AlertPanel from './components/AlertPanel/AlertPanel.jsx';
import StatusBar from './components/StatusBar/StatusBar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

// ─── Status Dot ───────────────────────────────────────────────
function StatusDot({ active, color }) {
  return (
    <motion.span
      animate={{ opacity: active ? [1, 0.3, 1] : 1 }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        display: 'inline-block',
        width: '6px', height: '6px',
        borderRadius: '50%',
        backgroundColor: active ? color : '#2a5a7c',
        boxShadow: active ? '0 0 5px ' + color : 'none',
        marginRight: '5px',
        verticalAlign: 'middle'
      }}
    />
  );
}

// ─── Tactical Button ──────────────────────────────────────────
function TBtn({ onClick, children, color = '#00d4ff', active = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0 0 8px ' + color + '55' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        backgroundColor: active ? color + '20' : 'transparent',
        border: '1px solid ' + (active ? color : '#1a3a5c'),
        color: active ? color : '#4a7fa5',
        padding: '3px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: 'Courier New',
        fontSize: '0.6rem',
        letterSpacing: '1px'
      }}
    >
      {children}
    </motion.button>
  );
}

// ─── Mini Radar ───────────────────────────────────────────────
function MiniRadar({ units, threats }) {
  const size = 110;
  const center = size / 2;
  const radius = size / 2 - 8;

  return (
    <div style={{
      width: size + 'px', height: size + 'px',
      position: 'relative',
      backgroundColor: 'rgba(0,15,8,0.9)',
      borderRadius: '50%',
      border: '1px solid #00ff8833',
      overflow: 'hidden',
      margin: '0 auto'
    }}>
      {[0.33, 0.66, 1].map((r, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: (radius * r * 2) + 'px',
          height: (radius * r * 2) + 'px',
          borderRadius: '50%',
          border: '1px solid #00ff8818',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)'
        }} />
      ))}
      <div style={{
        position: 'absolute', width: '100%',
        height: '1px', backgroundColor: '#00ff8812', top: '50%'
      }} />
      <div style={{
        position: 'absolute', width: '1px',
        height: '100%', backgroundColor: '#00ff8812', left: '50%'
      }} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          width: '50%', height: '2px',
          background: 'linear-gradient(90deg, transparent, #00ff88)',
          top: '50%', left: '50%',
          transformOrigin: 'left center'
        }}
      />
      {units.slice(0, 8).map((unit, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 0.35 + (i % 3) * 0.2;
        const x = center + Math.cos(angle) * radius * dist;
        const y = center + Math.sin(angle) * radius * dist;
        const isThreat = threats.some(t => t.unit_id === unit.unit_id);
        return (
          <motion.div
            key={unit.unit_id}
            animate={{ opacity: isThreat ? [1, 0.2, 1] : 0.8 }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              position: 'absolute',
              width: isThreat ? '5px' : '3px',
              height: isThreat ? '5px' : '3px',
              borderRadius: '50%',
              backgroundColor: isThreat ? '#ff2222' : '#00ff88',
              boxShadow: '0 0 4px ' + (isThreat ? '#ff2222' : '#00ff88'),
              left: x + 'px', top: y + 'px',
              transform: 'translate(-50%,-50%)'
            }}
          />
        );
      })}
      <div style={{
        position: 'absolute', width: '4px', height: '4px',
        borderRadius: '50%', backgroundColor: '#00ff88',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 4px #00ff88'
      }} />
    </div>
  );
}

// ─── Stats Cell ───────────────────────────────────────────────
function StatsCell({ units, alerts, trackedUnitId }) {
  const critical = alerts.filter(a => a.threatLevel === 'CRITICAL').length;
  const high = alerts.filter(a => a.threatLevel === 'HIGH').length;
  const medium = alerts.filter(a => a.threatLevel === 'MEDIUM').length;

  const stats = [
    { label: 'ACTIVE UNITS', value: units.length, color: '#00ff88' },
    { label: 'TOTAL THREATS', value: alerts.length, color: '#ff6600' },
    { label: 'CRITICAL', value: critical, color: '#ff2222' },
    { label: 'HIGH', value: high, color: '#ff6600' },
    { label: 'MEDIUM', value: medium, color: '#ffaa00' },
    { label: 'TRACKING', value: trackedUnitId || '---', color: '#00d4ff' }
  ];

  return (
    <div className="bento-cell glow-green" style={{ height: '100%' }}>
      <div className="cell-header">
        <span>SYSTEM STATS</span>
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: '#00ff88' }}
        >
          ● LIVE
        </motion.span>
      </div>
      <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {stats.map(({ label, value, color }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(5,10,14,0.5)',
            border: '1px solid #1a3a5c',
            borderRadius: '4px',
            padding: '5px 8px'
          }}>
            <span style={{ color: '#4a7fa5', fontSize: '0.6rem', letterSpacing: '1px' }}>
              {label}
            </span>
            <motion.span
              key={String(value)}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                color, fontWeight: 'bold',
                fontSize: '0.72rem',
                textShadow: '0 0 8px ' + color + '66'
              }}
            >
              {value}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Target Tracker Panel ─────────────────────────────────────
function TrackerCell({ target, onClose, onStopTracking, isPrimary }) {
  if (!target) return (
    <div className="bento-cell" style={{
      height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '8px'
    }}>
      <div className="cell-header" style={{ position: 'absolute', top: 0, width: '100%' }}>
        <span>TARGET TRACKER</span>
        <span style={{ color: '#2a5a7c' }}>IDLE</span>
      </div>
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: '#2a5a7c', fontSize: '2rem', marginTop: '30px' }}
      >
        ◎
      </motion.div>
      <span style={{ color: '#2a5a7c', fontSize: '0.62rem', letterSpacing: '2px' }}>
        NO TARGET SELECTED
      </span>
      <span style={{ color: '#1a3a5c', fontSize: '0.55rem' }}>
        Click a unit to track
      </span>
    </div>
  );

  const color = isPrimary ? '#ff2222' : '#00d4ff';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bento-cell"
      style={{ height: '100%' }}
    >
      <div className="cell-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <StatusDot active={true} color={color} />
          <span style={{ color }}>
            {isPrimary ? 'PRIMARY TARGET' : 'TRACKING'}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none',
            color: '#4a7fa5', cursor: 'pointer', fontSize: '0.7rem'
          }}
        >
          ✕
        </motion.button>
      </div>

      <div style={{ padding: '8px' }}>
        {/* Unit ID */}
        <div style={{
          color, fontWeight: 'bold',
          fontSize: '1rem', letterSpacing: '2px',
          marginBottom: '8px',
          textShadow: '0 0 10px ' + color + '66'
        }}>
          {target.unit_id}
        </div>

        {/* Data Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '4px', marginBottom: '8px'
        }}>
          {[
            ['TYPE', target.unit_type],
            ['SPEED', target.speed + ' kmh'],
            ['LAT', target.lat?.toFixed(4)],
            ['LNG', target.lng?.toFixed(4)],
            ['ALT', target.altitude + ' m'],
            ['HDG', (target.heading || 0).toFixed(1) + '°']
          ].map(([k, v]) => (
            <div key={k} style={{
              backgroundColor: 'rgba(5,10,14,0.6)',
              border: '1px solid #1a3a5c',
              borderRadius: '3px', padding: '4px 6px'
            }}>
              <div style={{
                color: '#4a7fa5', fontSize: '0.52rem',
                letterSpacing: '1px', marginBottom: '2px'
              }}>
                {k}
              </div>
              <div style={{
                color: '#e0f4ff', fontSize: '0.65rem',
                fontWeight: 'bold'
              }}>
                {v}
              </div>
            </div>
          ))}
        </div>

        {/* Speed Bar */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: '0.55rem', color: '#4a7fa5', marginBottom: '3px'
          }}>
            <span>SPEED INDICATOR</span>
            <span style={{
              color: target.speed > 800 ? '#ff2222' :
                     target.speed > 500 ? '#ff6600' : '#00ff88'
            }}>
              {target.speed > 800 ? 'SUPERSONIC' :
               target.speed > 500 ? 'HIGH' : 'NORMAL'}
            </span>
          </div>
          <div style={{
            width: '100%', height: '3px',
            backgroundColor: '#1a3a5c', borderRadius: '2px'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: Math.min((target.speed / 1000) * 100, 100) + '%' }}
              transition={{ duration: 0.6 }}
              style={{
                height: '100%',
                backgroundColor: target.speed > 800 ? '#ff2222' :
                                  target.speed > 500 ? '#ff6600' : '#00ff88',
                borderRadius: '2px'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: '4px', marginBottom: '6px'
        }}>
          {[
            { label: 'NEUTRALIZE', color: '#ff2222' },
            { label: 'INTERCEPT', color: '#ffaa00' },
            { label: 'MONITOR', color: '#00d4ff' }
          ].map(({ label, color: c }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05, boxShadow: '0 0 8px ' + c + '55' }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: c + '15',
                border: '1px solid ' + c + '55',
                color: c, padding: '5px 2px',
                borderRadius: '3px', cursor: 'pointer',
                fontFamily: 'Courier New', fontSize: '0.55rem',
                letterSpacing: '0.5px'
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>

        {/* Stop Tracking */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStopTracking}
          style={{
            width: '100%',
            backgroundColor: 'rgba(255,34,34,0.08)',
            border: '1px solid #ff222233',
            color: '#ff6666', padding: '5px',
            borderRadius: '3px', cursor: 'pointer',
            fontFamily: 'Courier New', fontSize: '0.6rem',
            letterSpacing: '1px'
          }}
        >
          STOP TRACKING
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Primary Target Detection ─────────────────────────────────
function detectPrimaryTarget(units, alerts) {
  if (units.length === 0) return null;
  const priority = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
  const alertMap = {};
  alerts.forEach(a => { alertMap[a.unit_id] = a; });
  let primary = null;
  let topScore = -1;
  units.forEach(unit => {
    const alert = alertMap[unit.unit_id];
    const score = (alert ? (priority[alert.threatLevel] || 0) * 1000 : 0) + (unit.speed || 0);
    if (score > topScore) { topScore = score; primary = unit; }
  });
  return primary;
}

// ─── Dashboard ────────────────────────────────────────────────
function Dashboard() {
  const { telemetry, connected, alerts, redAlert } = useSocket();
  const { user, logout } = useAuth();
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [trackedUnitId, setTrackedUnitId] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('NORMAL');

  useEffect(() => {
    document.body.classList.toggle('red-alert', redAlert);
  }, [redAlert]);

  const latestByUnit = useMemo(() => {
    const map = {};
    telemetry.forEach(t => { if (!map[t.unit_id]) map[t.unit_id] = t; });
    return map;
  }, [telemetry]);

  const units = useMemo(() => Object.values(latestByUnit), [latestByUnit]);
  const primaryUnit = useMemo(() => detectPrimaryTarget(units, alerts), [units, alerts]);
  const primaryUnitId = primaryUnit?.unit_id || null;

  const filteredTelemetry = useMemo(() => {
    return telemetry.filter(t => filter === 'ALL' || t.unit_type === filter);
  }, [telemetry, filter]);

  const handleTargetSelect = useCallback((unit) => {
    setSelectedTarget(unit);
    setTrackedUnitId(unit.unit_id);
  }, []);

  const handleStopTracking = useCallback(() => {
    setTrackedUnitId(null);
    setSelectedTarget(null);
  }, []);

  useEffect(() => {
    if (selectedTarget && latestByUnit[selectedTarget.unit_id]) {
      setSelectedTarget(latestByUnit[selectedTarget.unit_id]);
    }
  }, [latestByUnit]);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      backgroundColor: redAlert ? '#0d0000' : '#050a0e',
      fontFamily: 'Courier New, monospace',
      color: '#e0f4ff',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      transition: 'background-color 0.5s'
    }}>

      {/* Subtle Grid Background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── HEADER ─────────────────────────────────── */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          backgroundColor: '#0a1628',
          borderBottom: '1px solid ' + (redAlert ? '#ff2222' : '#1a3a5c'),
          padding: '0 16px',
          height: '46px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          flexShrink: 0
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{
              width: '20px', height: '20px',
              border: '2px solid #00d4ff',
              borderTop: '2px solid transparent',
              borderRadius: '50%'
            }}
          />
          <div>
            <div style={{
              color: redAlert ? '#ff2222' : '#00d4ff',
              fontSize: '0.95rem', fontWeight: 'bold',
              letterSpacing: '4px',
              textShadow: '0 0 10px ' + (redAlert ? '#ff222244' : '#00d4ff44')
            }}>
              SENTIENTWEB
            </div>
            <div style={{
              color: '#2a5a7c', fontSize: '0.52rem', letterSpacing: '2px'
            }}>
              C4ISR TACTICAL DASHBOARD v1.0
            </div>
          </div>

          <AnimatePresence>
            {redAlert && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{
                  color: '#ff2222', fontSize: '0.65rem',
                  fontWeight: 'bold', letterSpacing: '2px',
                  padding: '2px 8px',
                  border: '1px solid #ff2222',
                  borderRadius: '3px'
                }}
              >
                RED ALERT
              </motion.div>
            )}
          </AnimatePresence>

          {primaryUnitId && (
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                backgroundColor: 'rgba(255,34,34,0.1)',
                border: '1px solid #ff222255',
                borderRadius: '3px',
                padding: '2px 8px',
                fontSize: '0.58rem',
                color: '#ff2222',
                letterSpacing: '1px',
                display: 'flex', alignItems: 'center', gap: '5px'
              }}
            >
              <StatusDot active={true} color="#ff2222" />
              PRIMARY: {primaryUnitId}
            </motion.div>
          )}
        </div>

        {/* Center Controls */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {['NORMAL', 'THREAT', 'ALL UNITS'].map(mode => (
            <TBtn
              key={mode}
              active={viewMode === mode}
              color="#00d4ff"
              onClick={() => setViewMode(mode)}
            >
              {mode}
            </TBtn>
          ))}
          <div style={{ width: '1px', height: '16px', backgroundColor: '#1a3a5c' }} />
          {trackedUnitId && (
            <TBtn color="#ff2222" onClick={handleStopTracking}>
              STOP TRACK
            </TBtn>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.62rem' }}>
          <div style={{
            padding: '3px 10px',
            border: '1px solid #1a3a5c',
            borderRadius: '4px',
            backgroundColor: 'rgba(5,10,14,0.6)'
          }}>
            <span style={{ color: '#00d4ff' }}>{user.role.toUpperCase()}</span>
            <span style={{ color: '#2a5a7c' }}> / </span>
            <span style={{ color: '#e0f4ff' }}>{user.username}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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

          <motion.div
            key={alerts.length}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{
              backgroundColor: alerts.length > 0 ? '#ff2222' : '#1a3a5c',
              color: '#fff', padding: '2px 10px',
              borderRadius: '10px', fontWeight: 'bold',
              fontSize: '0.65rem',
              boxShadow: alerts.length > 0 ? '0 0 8px rgba(255,34,34,0.4)' : 'none'
            }}
          >
            {alerts.length} THREATS
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #1a3a5c',
              color: '#4a7fa5', padding: '3px 10px',
              borderRadius: '4px', cursor: 'pointer',
              fontFamily: 'Courier New', fontSize: '0.6rem',
              letterSpacing: '1px'
            }}
          >
            LOGOUT
          </motion.button>
        </div>
      </motion.div>

      {/* ── BENTO GRID MAIN ────────────────────────── */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 160px 280px',
        gridTemplateRows: '1fr 140px',
        gap: '6px',
        padding: '6px',
        overflow: 'hidden',
        position: 'relative', zIndex: 1
      }}>

        {/* Cell 1 — MAP (spans 2 rows) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bento-cell"
          style={{ gridRow: '1 / 3', position: 'relative', overflow: 'hidden' }}
        >
          <div className="cell-header" style={{ position: 'absolute', top: 0, width: '100%', zIndex: 500 }}>
            <span>TACTICAL MAP</span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: '#00ff88', fontSize: '0.58rem' }}
            >
              ● LIVE FEED
            </motion.span>
          </div>
          <div style={{ width: '100%', height: '100%', paddingTop: '28px' }}>
            <TacticalMap
              telemetry={telemetry}
              alerts={alerts}
              onSelectTarget={handleTargetSelect}
              trackedUnitId={trackedUnitId}
              primaryUnitId={primaryUnitId}
            />
          </div>
        </motion.div>

        {/* Cell 2 — STATS + RADAR (top middle) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          {/* Radar */}
          <div className="bento-cell" style={{ flex: '0 0 auto', padding: '6px' }}>
            <div className="cell-header" style={{ marginBottom: '6px' }}>
              <span>RADAR</span>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ color: '#00ff88', display: 'inline-block' }}
              >
                ↻
              </motion.span>
            </div>
            <MiniRadar units={units} threats={alerts} />
          </div>

          {/* Stats */}
          <div style={{ flex: 1 }}>
            <StatsCell
              units={units}
              alerts={alerts}
              trackedUnitId={trackedUnitId}
            />
          </div>
        </motion.div>

        {/* Cell 3 — ALERT PANEL (top right) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bento-cell"
          style={{ overflow: 'hidden' }}
        >
          <AlertPanel
            alerts={alerts}
            primaryUnitId={primaryUnitId}
          />
        </motion.div>

        {/* Cell 4 — TRACKER (bottom middle) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={{ overflow: 'hidden' }}
        >
          <TrackerCell
            target={selectedTarget}
            onClose={() => setSelectedTarget(null)}
            onStopTracking={handleStopTracking}
            isPrimary={primaryUnitId === selectedTarget?.unit_id}
          />
        </motion.div>

        {/* Cell 5 — TELEMETRY (bottom right) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bento-cell"
          style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div className="cell-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: '#00ff88', fontSize: '0.6rem' }}
              >
                ●
              </motion.span>
              <span>TELEMETRY FEED</span>
            </div>
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                backgroundColor: '#050a0e',
                border: '1px solid #1a3a5c',
                color: '#00d4ff', padding: '1px 4px',
                borderRadius: '3px', fontFamily: 'Courier New',
                fontSize: '0.55rem', cursor: 'pointer', outline: 'none'
              }}
            >
              {['ALL','DRONE','UAV','MISSILE','AIRCRAFT','RADAR'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Feed */}
          <div style={{ overflowX: 'auto', flex: 1, padding: '4px 6px' }}>
            <div style={{ display: 'flex', gap: '5px', minWidth: 'max-content' }}>
              <AnimatePresence>
                {filteredTelemetry.slice(0, 12).map((t, i) => {
                  const isTracked = t.unit_id === trackedUnitId;
                  const isPrimary = t.unit_id === primaryUnitId;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.03, borderColor: '#00d4ff' }}
                      onClick={() => handleTargetSelect(t)}
                      style={{
                        backgroundColor: isTracked
                          ? 'rgba(0,212,255,0.08)'
                          : isPrimary
                            ? 'rgba(255,34,34,0.08)'
                            : 'rgba(5,10,14,0.8)',
                        border: '1px solid ' + (
                          isTracked ? '#00d4ff44' :
                          isPrimary ? '#ff222244' : '#1a3a5c'
                        ),
                        borderRadius: '5px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        minWidth: '110px',
                        flexShrink: 0
                      }}
                    >
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: '3px', gap: '4px'
                      }}>
                        <span style={{
                          color: isTracked ? '#00d4ff' :
                                 isPrimary ? '#ff2222' : '#00ff88',
                          fontWeight: 'bold', fontSize: '0.6rem'
                        }}>
                          {t.unit_id}
                        </span>
                        <span style={{
                          backgroundColor: 'rgba(0,212,255,0.1)',
                          color: '#00d4ff',
                          padding: '0 3px', borderRadius: '2px',
                          fontSize: '0.52rem',
                          border: '1px solid rgba(0,212,255,0.2)'
                        }}>
                          {t.unit_type}
                        </span>
                      </div>
                      <div style={{
                        color: '#4a7fa5', fontSize: '0.58rem',
                        marginBottom: '2px'
                      }}>
                        {t.lat.toFixed(2)}, {t.lng.toFixed(2)}
                      </div>
                      <div style={{
                        color: t.speed > 800 ? '#ff2222' : '#aaccdd',
                        fontSize: '0.6rem', fontWeight: 'bold'
                      }}>
                        {t.speed} kmh
                      </div>
                      {(isTracked || isPrimary) && (
                        <div style={{
                          marginTop: '3px',
                          fontSize: '0.5rem',
                          color: isTracked ? '#00d4ff' : '#ff2222',
                          letterSpacing: '1px'
                        }}>
                          {isTracked ? 'TRACKED' : 'PRIMARY'}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── STATUS BAR ─────────────────────────────── */}
      <StatusBar connected={connected} alerts={alerts} user={user} />

    </div>
  );
}

function App() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginPage />;
}

export default App;