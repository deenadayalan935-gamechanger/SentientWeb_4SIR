import { motion, AnimatePresence } from 'framer-motion';

const getThreatConfig = (level, unitType) => {
  if (level === 'CRITICAL') return {
    border: '#ff2222',
    bg: 'rgba(26,0,0,0.85)',
    badge: '#ff2222',
    glow: '0 0 15px rgba(255,34,34,0.4)',
    label: 'CRITICAL'
  };
  if (level === 'HIGH') return {
    border: '#ff6600',
    bg: 'rgba(26,8,0,0.85)',
    badge: '#ff6600',
    glow: '0 0 12px rgba(255,102,0,0.3)',
    label: 'HIGH'
  };
  if (unitType === 'DRONE' || unitType === 'UAV') return {
    border: '#ffaa00',
    bg: 'rgba(26,16,0,0.85)',
    badge: '#ffaa00',
    glow: '0 0 10px rgba(255,170,0,0.25)',
    label: 'MEDIUM'
  };
  return {
    border: '#00d4ff',
    bg: 'rgba(0,26,26,0.85)',
    badge: '#00d4ff',
    glow: '0 0 8px rgba(0,212,255,0.2)',
    label: 'LOW'
  };
};

const getUnitBadgeColor = (unitType) => {
  const map = {
    MISSILE: '#ff2222',
    DRONE: '#ffaa00',
    UAV: '#ffaa00',
    AIRCRAFT: '#aa44ff',
    RADAR: '#00d4ff'
  };
  return map[unitType] || '#ffffff';
};

function ConfidenceBar({ value }) {
  const color = value >= 80 ? '#ff2222' : value >= 60 ? '#ff6600' : '#ffaa00';
  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.6rem',
        color: '#4a7fa5',
        marginBottom: '3px'
      }}>
        <span>CONFIDENCE</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div style={{
        width: '100%',
        height: '3px',
        backgroundColor: '#1a3a5c',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: value + '%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: color,
            borderRadius: '2px',
            boxShadow: '0 0 6px ' + color
          }}
        />
      </div>
    </div>
  );
}

function AlertCard({ alert, isNewest }) {
  const config = getThreatConfig(alert.threatLevel, alert.unit_type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
      style={{
        backgroundColor: config.bg,
        border: '1px solid ' + config.border,
        borderLeft: '3px solid ' + config.border,
        borderRadius: '6px',
        padding: '10px',
        marginBottom: '8px',
        boxShadow: isNewest ? config.glow : 'none',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Newest indicator */}
      {isNewest && (
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: 3 }}
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: config.border,
            boxShadow: '0 0 6px ' + config.border
          }}
        />
      )}

      {/* Top Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <span style={{
            backgroundColor: config.badge,
            color: '#000',
            padding: '1px 6px',
            borderRadius: '3px',
            fontWeight: 'bold',
            fontSize: '0.6rem',
            letterSpacing: '1px'
          }}>
            {config.label}
          </span>
          <span style={{
            backgroundColor: getUnitBadgeColor(alert.unit_type),
            color: '#000',
            padding: '1px 6px',
            borderRadius: '3px',
            fontSize: '0.6rem',
            fontWeight: 'bold'
          }}>
            {alert.unit_type}
          </span>
        </div>
        <span style={{ color: '#4a7fa5', fontSize: '0.6rem' }}>
          {new Date(alert.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Unit ID */}
      <div style={{
        color: '#00d4ff',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        marginBottom: '4px',
        letterSpacing: '1px'
      }}>
        {alert.unit_id}
      </div>

      {/* Threat Type */}
      <div style={{
        color: config.border,
        fontSize: '0.72rem',
        marginBottom: '3px'
      }}>
        {alert.threatType}
      </div>

      {/* Recommendation */}
      <div style={{
        color: '#aaccdd',
        fontSize: '0.68rem',
        lineHeight: '1.4',
        marginBottom: '4px'
      }}>
        {alert.recommendation}
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#4a7fa5',
        fontSize: '0.65rem',
        marginBottom: '4px'
      }}>
        <span>SPD: <span style={{ color: '#e0f4ff' }}>{alert.speed}</span></span>
        <span>ALT: <span style={{ color: '#e0f4ff' }}>{alert.altitude}m</span></span>
        <span>HDG: <span style={{ color: '#e0f4ff' }}>{alert.heading || 'N/A'}</span></span>
      </div>

      {/* Confidence Bar */}
      {alert.confidence > 0 && (
        <ConfidenceBar value={alert.confidence} />
      )}

    </motion.div>
  );
}

function AlertPanel({ alerts }) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgba(8,15,24,0.95)',
      backdropFilter: 'blur(10px)'
    }}>

      {/* Panel Header */}
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
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: alerts.length > 0 ? '#ff2222' : '#4a7fa5'
            }}
          />
          <span style={{ color: '#4a7fa5', fontSize: '0.72rem', letterSpacing: '2px' }}>
            AI THREAT ALERTS
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

      {/* Alerts List */}
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
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>◎</div>
              No threats detected
            </motion.div>
          )}

          {alerts.map((alert, index) => (
            <AlertCard
              key={alert.id || index}
              alert={alert}
              isNewest={index === 0}
            />
          ))}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default AlertPanel;