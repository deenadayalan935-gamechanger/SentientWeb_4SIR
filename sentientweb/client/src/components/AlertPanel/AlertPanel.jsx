import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  InterceptAnimation,
  NeutralizeAnimation,
  MonitorAnimation
} from '../Actions/TacticalActions.jsx';

const getThreatConfig = (level, unitType) => {
  if (level === 'CRITICAL') return {
    border: '#ff2222', bg: 'rgba(26,0,0,0.85)',
    badge: '#ff2222', glow: '0 0 15px rgba(255,34,34,0.4)', label: 'CRITICAL'
  };
  if (level === 'HIGH') return {
    border: '#ff6600', bg: 'rgba(26,8,0,0.85)',
    badge: '#ff6600', glow: '0 0 12px rgba(255,102,0,0.3)', label: 'HIGH'
  };
  if (unitType === 'DRONE' || unitType === 'UAV') return {
    border: '#ffaa00', bg: 'rgba(26,16,0,0.85)',
    badge: '#ffaa00', glow: '0 0 10px rgba(255,170,0,0.25)', label: 'MEDIUM'
  };
  return {
    border: '#00d4ff', bg: 'rgba(0,26,26,0.85)',
    badge: '#00d4ff', glow: '0 0 8px rgba(0,212,255,0.2)', label: 'LOW'
  };
};

const getUnitBadgeColor = (unitType) => {
  const map = {
    MISSILE: '#ff2222', DRONE: '#ffaa00',
    UAV: '#ffaa00', AIRCRAFT: '#aa44ff', RADAR: '#00d4ff'
  };
  return map[unitType] || '#ffffff';
};

function ConfidenceBar({ value }) {
  const color = value >= 80 ? '#ff2222' : value >= 60 ? '#ff6600' : '#ffaa00';
  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.6rem', color: '#4a7fa5', marginBottom: '3px'
      }}>
        <span>CONFIDENCE</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div style={{
        width: '100%', height: '3px',
        backgroundColor: '#1a3a5c', borderRadius: '2px', overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: value + '%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%', backgroundColor: color,
            borderRadius: '2px', boxShadow: '0 0 6px ' + color
          }}
        />
      </div>
    </div>
  );
}

function ActionToast({ message, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.9 }}
      style={{
        position: 'absolute',
        top: '-36px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: color + '22',
        border: '1px solid ' + color,
        borderRadius: '4px',
        padding: '4px 12px',
        fontSize: '0.6rem',
        color: color,
        whiteSpace: 'nowrap',
        zIndex: 100,
        pointerEvents: 'none',
        letterSpacing: '1px'
      }}
    >
      {message}
    </motion.div>
  );
}

function AlertCard({ alert, isNewest, isPrimary }) {
  const config = getThreatConfig(alert.threatLevel, alert.unit_type);
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [actionState, setActionState] = useState(null);
  const [showIntercept, setShowIntercept] = useState(false);
  const [showNeutralize, setShowNeutralize] = useState(false);
  const [showMonitor, setShowMonitor] = useState(false);

  const showToast = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const handleNeutralize = (e) => {
    e.stopPropagation();
    setShowNeutralize(true);
    setActionState('NEUTRALIZED');
    showToast('NEUTRALIZE ORDER SENT', '#ff2222');
  };

  const handleIntercept = (e) => {
    e.stopPropagation();
    setShowIntercept(true);
    setActionState('INTERCEPT');
    showToast('INTERCEPT SEQUENCE INITIATED', '#ffaa00');
  };

  const handleMonitor = (e) => {
    e.stopPropagation();
    setShowMonitor(true);
    setActionState('MONITORING');
    showToast('SURVEILLANCE FEED ACTIVE', '#00d4ff');
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <>
      {/* Global Action Animations */}
      <AnimatePresence>
        {showIntercept && (
          <InterceptAnimation onComplete={() => setShowIntercept(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNeutralize && (
          <NeutralizeAnimation
            targetId={alert.unit_id}
            onComplete={() => setShowNeutralize(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showMonitor && (
          <MonitorAnimation
            targetId={alert.unit_id}
            onComplete={() => setShowMonitor(false)}
          />
        )}
      </AnimatePresence>

      {/* Alert Card */}
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -40, scale: 0.9 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        whileHover={{ scale: 1.01 }}
        onClick={() => setExpanded(!expanded)}
        style={{
          backgroundColor: config.bg,
          border: '1px solid ' + (isPrimary ? '#ff2222' : config.border),
          borderLeft: '3px solid ' + (isPrimary ? '#ff2222' : config.border),
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '8px',
          boxShadow: isPrimary
            ? '0 0 20px rgba(255,34,34,0.35)'
            : isNewest ? config.glow : 'none',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Toast */}
        <AnimatePresence>
          {toast && <ActionToast message={toast.msg} color={toast.color} />}
        </AnimatePresence>

        {/* Primary Target Banner */}
        {isPrimary && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              backgroundColor: 'rgba(255,34,34,0.15)',
              border: '1px solid #ff222244',
              borderRadius: '3px',
              padding: '3px 8px',
              fontSize: '0.58rem',
              color: '#ff2222',
              letterSpacing: '2px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              style={{
                width: '5px', height: '5px',
                borderRadius: '50%', backgroundColor: '#ff2222',
                boxShadow: '0 0 6px #ff2222'
              }}
            />
            PRIMARY TARGET LOCKED
          </motion.div>
        )}

        {/* Action State Banner */}
        {actionState && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              backgroundColor: actionState === 'NEUTRALIZED'
                ? 'rgba(255,34,34,0.15)'
                : actionState === 'INTERCEPT'
                  ? 'rgba(255,170,0,0.15)'
                  : 'rgba(0,212,255,0.15)',
              border: '1px solid ' + (
                actionState === 'NEUTRALIZED' ? '#ff222244' :
                actionState === 'INTERCEPT' ? '#ffaa0044' : '#00d4ff44'
              ),
              borderRadius: '3px',
              padding: '3px 8px',
              fontSize: '0.58rem',
              color: actionState === 'NEUTRALIZED' ? '#ff2222' :
                     actionState === 'INTERCEPT' ? '#ffaa00' : '#00d4ff',
              letterSpacing: '1px',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                width: '4px', height: '4px',
                borderRadius: '50%',
                backgroundColor: actionState === 'NEUTRALIZED' ? '#ff2222' :
                                  actionState === 'INTERCEPT' ? '#ffaa00' : '#00d4ff'
              }}
            />
            STATUS: {actionState}
          </motion.div>
        )}

        {/* Top Row — Badges + Time */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '6px'
        }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{
              backgroundColor: config.badge, color: '#000',
              padding: '1px 6px', borderRadius: '3px',
              fontWeight: 'bold', fontSize: '0.6rem', letterSpacing: '1px'
            }}>
              {config.label}
            </span>
            <span style={{
              backgroundColor: getUnitBadgeColor(alert.unit_type),
              color: '#000', padding: '1px 6px',
              borderRadius: '3px', fontSize: '0.6rem', fontWeight: 'bold'
            }}>
              {alert.unit_type}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isNewest && (
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.8, repeat: 4 }}
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: config.border,
                  boxShadow: '0 0 6px ' + config.border
                }}
              />
            )}
            <span style={{ color: '#4a7fa5', fontSize: '0.6rem' }}>
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Unit ID */}
        <div style={{
          color: '#00d4ff', fontWeight: 'bold',
          fontSize: '0.8rem', marginBottom: '4px', letterSpacing: '1px'
        }}>
          {alert.unit_id}
        </div>

        {/* Threat Type */}
        <div style={{
          color: config.border, fontSize: '0.72rem', marginBottom: '3px'
        }}>
          {alert.threatType}
        </div>

        {/* Recommendation */}
        <div style={{
          color: '#aaccdd', fontSize: '0.68rem',
          lineHeight: '1.4', marginBottom: '6px'
        }}>
          {alert.recommendation}
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          color: '#4a7fa5', fontSize: '0.62rem', marginBottom: '4px'
        }}>
          <span>SPD: <span style={{ color: '#e0f4ff' }}>{alert.speed}</span></span>
          <span>ALT: <span style={{ color: '#e0f4ff' }}>{alert.altitude}m</span></span>
          <span style={{ color: '#1a3a5c' }}>
            {expanded ? '▲ LESS' : '▼ DETAILS'}
          </span>
        </div>

        {/* Confidence Bar */}
        {alert.confidence > 0 && <ConfidenceBar value={alert.confidence} />}

        {/* Expanded Section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: '10px',
                paddingTop: '8px',
                borderTop: '1px solid #1a3a5c'
              }}>

                {/* Detail Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px',
                  marginBottom: '10px',
                  fontSize: '0.62rem'
                }}>
                  {[
                    ['LAT', alert.lat?.toFixed(4)],
                    ['LNG', alert.lng?.toFixed(4)],
                    ['ANOMALIES', alert.anomalies?.length || 0],
                    ['SOURCE', 'MAS']
                  ].map(([k, v]) => (
                    <div key={k} style={{
                      backgroundColor: 'rgba(13,31,45,0.8)',
                      border: '1px solid #1a3a5c',
                      borderRadius: '3px',
                      padding: '4px 8px'
                    }}>
                      <div style={{
                        color: '#4a7fa5',
                        fontSize: '0.55rem',
                        marginBottom: '2px'
                      }}>
                        {k}
                      </div>
                      <div style={{ color: '#e0f4ff', fontWeight: 'bold' }}>
                        {v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Anomalies List */}
                {alert.anomalies?.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    {alert.anomalies.map((a, i) => (
                      <div key={i} style={{
                        color: '#ffaa00',
                        fontSize: '0.6rem',
                        padding: '2px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ color: '#ff6600' }}>▶</span>
                        {a}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gap: '4px'
                }}>
                  {[
                    { label: 'NEUTRALIZE', color: '#ff2222', fn: handleNeutralize },
                    { label: 'INTERCEPT', color: '#ffaa00', fn: handleIntercept },
                    { label: 'MONITOR', color: '#00d4ff', fn: handleMonitor },
                    { label: 'DISMISS', color: '#4a7fa5', fn: handleDismiss }
                  ].map(({ label, color, fn }) => (
                    <motion.button
                      key={label}
                      whileHover={{
                        scale: 1.06,
                        boxShadow: '0 0 10px ' + color + '66'
                      }}
                      whileTap={{ scale: 0.94 }}
                      onClick={fn}
                      style={{
                        backgroundColor: color + '18',
                        border: '1px solid ' + color + '66',
                        color: color,
                        padding: '5px 2px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontFamily: 'Courier New',
                        fontSize: '0.55rem',
                        letterSpacing: '0.5px',
                        transition: 'all 0.15s'
                      }}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function AlertPanel({ alerts, primaryUnitId }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgba(8,15,24,0.95)',
      backdropFilter: 'blur(10px)'
    }}>

      {/* Header */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #1a3a5c',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(10,22,40,0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div
            animate={{ opacity: alerts.length > 0 ? [1, 0.3, 1] : 1 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              backgroundColor: alerts.length > 0 ? '#ff2222' : '#4a7fa5'
            }}
          />
          <span style={{
            color: '#4a7fa5', fontSize: '0.72rem', letterSpacing: '2px'
          }}>
            AI THREAT ALERTS
          </span>
          <span style={{ color: '#1a3a5c', fontSize: '0.58rem' }}>
            CLICK TO EXPAND
          </span>
        </div>
        <motion.span
          key={alerts.length}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          style={{
            backgroundColor: alerts.length > 0 ? '#ff2222' : '#1a3a5c',
            color: '#fff',
            padding: '1px 8px',
            borderRadius: '10px',
            fontSize: '0.65rem',
            fontWeight: 'bold'
          }}
        >
          {alerts.length}
        </motion.span>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        <AnimatePresence>
          {alerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: '#4a7fa5',
                fontSize: '0.72rem',
                textAlign: 'center',
                marginTop: '30px'
              }}
            >
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: '1.5rem', marginBottom: '8px' }}
              >
                ◎
              </motion.div>
              No threats detected
            </motion.div>
          )}

          {alerts.map((alert, index) => (
            <AlertCard
              key={alert.id || index}
              alert={alert}
              isNewest={index === 0}
              isPrimary={alert.unit_id === primaryUnitId}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AlertPanel;