import { useEffect, useRef } from 'react';

const getThreatConfig = (level, unitType) => {
  if (level === 'CRITICAL') return {
    border: '#ff2222',
    bg: '#1a0000',
    badge: '#ff2222',
    label: 'CRITICAL'
  };
  if (level === 'HIGH') return {
    border: '#ff6600',
    bg: '#1a0800',
    badge: '#ff6600',
    label: 'HIGH'
  };
  if (unitType === 'DRONE' || unitType === 'UAV') return {
    border: '#ffaa00',
    bg: '#1a1000',
    badge: '#ffaa00',
    label: 'MEDIUM'
  };
  return {
    border: '#00d4ff',
    bg: '#001a1a',
    badge: '#00d4ff',
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

function AlertCard({ alert, isNewest }) {
  const config = getThreatConfig(alert.threatLevel, alert.unit_type);

  return (
    <div style={{
      backgroundColor: config.bg,
      border: '1px solid ' + config.border,
      borderLeft: '3px solid ' + config.border,
      borderRadius: '4px',
      padding: '10px',
      marginBottom: '8px',
      fontSize: '0.72rem',
      animation: isNewest ? 'pulseBorder 1s ease-in-out 3' : 'none',
      position: 'relative'
    }}>

      {/* Top Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{
            backgroundColor: config.badge,
            color: '#000',
            padding: '1px 6px',
            borderRadius: '3px',
            fontWeight: 'bold',
            fontSize: '0.65rem'
          }}>
            {config.label}
          </span>
          <span style={{
            backgroundColor: getUnitBadgeColor(alert.unit_type),
            color: '#000',
            padding: '1px 6px',
            borderRadius: '3px',
            fontSize: '0.65rem',
            fontWeight: 'bold'
          }}>
            {alert.unit_type}
          </span>
        </div>
        <span style={{ color: '#4a7fa5', fontSize: '0.62rem' }}>
          {new Date(alert.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Unit ID */}
      <div style={{
        color: '#00d4ff',
        fontWeight: 'bold',
        marginBottom: '4px'
      }}>
        {alert.unit_id}
      </div>

      {/* Threat Type */}
      <div style={{
        color: config.border,
        marginBottom: '4px'
      }}>
        {alert.threatType}
      </div>

      {/* Recommendation */}
      <div style={{
        color: '#aaccdd',
        marginBottom: '6px',
        lineHeight: '1.4'
      }}>
        {alert.recommendation}
      </div>

      {/* Bottom Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#4a7fa5'
      }}>
        <span>SPD: {alert.speed} kmh</span>
        <span>ALT: {alert.altitude} m</span>
        {alert.confidence > 0 && (
          <span style={{ color: '#00ff88' }}>
            CONF: {alert.confidence}%
          </span>
        )}
      </div>

    </div>
  );
}

function AlertPanel({ alerts }) {
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [alerts.length]);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#080f18'
    }}>

      {/* Panel Header */}
      <div style={{
        padding: '8px 10px',
        borderBottom: '1px solid #1a3a5c',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ color: '#4a7fa5', fontSize: '0.72rem' }}>
          AI THREAT ALERTS
        </span>
        <span style={{
          backgroundColor: alerts.length > 0 ? '#ff2222' : '#1a3a5c',
          color: '#fff',
          padding: '1px 8px',
          borderRadius: '10px',
          fontSize: '0.65rem',
          fontWeight: 'bold'
        }}>
          {alerts.length}
        </span>
      </div>

      {/* Alerts List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
        <div ref={topRef} />

        {alerts.length === 0 && (
          <div style={{
            color: '#4a7fa5',
            fontSize: '0.72rem',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            No threats detected
          </div>
        )}

        {alerts.map((alert, index) => (
          <AlertCard
            key={alert.id || index}
            alert={alert}
            isNewest={index === 0}
          />
        ))}
      </div>

    </div>
  );
}

export default AlertPanel;