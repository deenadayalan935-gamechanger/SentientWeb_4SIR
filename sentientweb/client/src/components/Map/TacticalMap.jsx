import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Utilities ────────────────────────────────────────────────

const getMarkerColor = (unitType, threatLevel) => {
  if (threatLevel === 'CRITICAL') return '#ff2222';
  if (threatLevel === 'HIGH') return '#ff6600';
  if (unitType === 'MISSILE') return '#ff2222';
  if (unitType === 'DRONE' || unitType === 'UAV') return '#ffaa00';
  if (unitType === 'AIRCRAFT') return '#aa44ff';
  if (unitType === 'RADAR') return '#00d4ff';
  return '#00ff88';
};

const getUnitSymbol = (unitType) => {
  const symbols = {
    MISSILE: '▲',
    DRONE: '◆',
    UAV: '◆',
    AIRCRAFT: '●',
    RADAR: '◎'
  };
  return symbols[unitType] || '●';
};

const createIcon = (unitType, isThreat, color, isTracked, isPrimary) => {
  const base = isPrimary ? 18 : isThreat ? 15 : 11;
  const symbol = getUnitSymbol(unitType);
  const rings = isPrimary ? 3 : isThreat ? 2 : 0;
  const glowSize = isPrimary ? 20 : isThreat ? 14 : 6;

  const ringHTML = Array.from({ length: rings }, (_, i) => `
    <div style="
      position:absolute;
      width:${base + 10 + i * 12}px;
      height:${base + 10 + i * 12}px;
      border-radius:50%;
      border:${isPrimary ? '2px' : '1.5px'} solid ${color};
      top:50%; left:50%;
      transform:translate(-50%,-50%);
      animation:pulseRing ${1.2 + i * 0.3}s ease-out infinite ${i * 0.3}s;
      opacity:${isPrimary ? 0.8 : 0.5};
    "></div>
  `).join('');

  const trackedRing = isTracked ? `
    <div style="
      position:absolute;
      width:${base + 28}px;
      height:${base + 28}px;
      border-radius:50%;
      border:2px dashed #00d4ff;
      top:50%; left:50%;
      transform:translate(-50%,-50%);
      animation:spin 3s linear infinite;
      opacity:0.8;
    "></div>
  ` : '';

  const totalSize = base + 40;

  return L.divIcon({
    className: '',
    html: `
      <style>
        @keyframes spin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
      </style>
      <div style="
        position:relative;
        width:${totalSize}px;
        height:${totalSize}px;
        display:flex;
        align-items:center;
        justify-content:center;
      ">
        ${ringHTML}
        ${trackedRing}
        <div style="
          width:${base}px;
          height:${base}px;
          background:${color};
          border:${isPrimary ? '3px' : '2px'} solid #ffffff;
          border-radius:50%;
          box-shadow:0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}44;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:${base * 0.45}px;
          color:#000;
          font-weight:bold;
          position:relative;
          z-index:2;
        ">${symbol}</div>
      </div>
    `,
    iconSize: [totalSize, totalSize],
    iconAnchor: [totalSize / 2, totalSize / 2]
  });
};

// ─── Map Controller ───────────────────────────────────────────

function MapController({ trackedUnit }) {
  const map = useMap();
  const prevPos = useRef(null);

  useEffect(() => {
    if (!trackedUnit) return;

    const newPos = [trackedUnit.lat, trackedUnit.lng];

    if (prevPos.current) {
      const dist = map.distance(prevPos.current, newPos);
      if (dist > 10) {
        map.panTo(newPos, { animate: true, duration: 0.8 });
      }
    } else {
      map.flyTo(newPos, 7, { animate: true, duration: 1.2 });
    }

    prevPos.current = newPos;
  }, [trackedUnit?.lat, trackedUnit?.lng]);

  return null;
}

// ─── Main Map Component ───────────────────────────────────────

function TacticalMap({ telemetry, alerts, onSelectTarget, trackedUnitId, primaryUnitId }) {
  const [trailHistory, setTrailHistory] = useState({});

  useEffect(() => {
    if (telemetry.length === 0) return;

    const latest = telemetry[0];
    setTrailHistory(prev => {
      const existing = prev[latest.unit_id] || [];
      const newPos = [latest.lat, latest.lng];
      const last = existing[existing.length - 1];

      if (last && last[0] === newPos[0] && last[1] === newPos[1]) return prev;

      const updated = [...existing, newPos].slice(-6);
      return { ...prev, [latest.unit_id]: updated };
    });
  }, [telemetry]);

  const latestByUnit = {};
  telemetry.forEach(t => {
    if (!latestByUnit[t.unit_id]) latestByUnit[t.unit_id] = t;
  });

  const threatMap = {};
  alerts.forEach(a => { threatMap[a.unit_id] = a; });

  const units = Object.values(latestByUnit);
  const trackedUnit = trackedUnitId ? latestByUnit[trackedUnitId] : null;

  const getTrailColor = (unitId) => {
    const alert = threatMap[unitId];
    if (!alert) return '#00ff8844';
    if (alert.threatLevel === 'CRITICAL') return '#ff222244';
    if (alert.threatLevel === 'HIGH') return '#ff660044';
    return '#ffaa0044';
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>

      {/* Map Labels */}
      <div style={{
        position: 'absolute',
        top: '100px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{
          backgroundColor: 'rgba(8,15,24,0.88)',
          border: '1px solid #1a3a5c',
          borderRadius: '4px',
          padding: '4px 10px',
          fontSize: '0.62rem',
          color: '#4a7fa5',
          letterSpacing: '2px',
          backdropFilter: 'blur(8px)'
        }}>
          TACTICAL OVERLAY — LIVE
        </div>

        {trackedUnitId && (
          <div style={{
            backgroundColor: 'rgba(0,212,255,0.1)',
            border: '1px solid #00d4ff',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '0.62rem',
            color: '#00d4ff',
            letterSpacing: '2px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#00d4ff',
              animation: 'pulse 1s infinite'
            }} />
            TRACKING: {trackedUnitId}
          </div>
        )}

        {primaryUnitId && (
          <div style={{
            backgroundColor: 'rgba(255,34,34,0.1)',
            border: '1px solid #ff2222',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '0.62rem',
            color: '#ff2222',
            letterSpacing: '2px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#ff2222',
              animation: 'pulse 0.5s infinite'
            }} />
            PRIMARY TARGET: {primaryUnitId}
          </div>
        )}
      </div>

      {/* Unit Count */}
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'rgba(8,15,24,0.88)',
        border: '1px solid #1a3a5c',
        borderRadius: '4px',
        padding: '4px 10px',
        fontSize: '0.62rem',
        color: '#00ff88',
        letterSpacing: '2px',
        backdropFilter: 'blur(8px)'
      }}>
        UNITS: {units.length}
      </div>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='CartoDB'
        />

        <MapController trackedUnit={trackedUnit} />

        {/* Trail Polylines */}
        {Object.entries(trailHistory).map(([unitId, positions]) => {
          if (positions.length < 2) return null;
          const color = getTrailColor(unitId);

          return positions.slice(0, -1).map((pos, i) => (
            <Polyline
              key={unitId + '-trail-' + i}
              positions={[pos, positions[i + 1]]}
              pathOptions={{
                color: color.slice(0, 7),
                weight: 2,
                opacity: (i + 1) / positions.length * 0.7,
                dashArray: '4 4'
              }}
            />
          ));
        })}

        {/* Unit Markers */}
        {units.map((unit) => {
          const alert = threatMap[unit.unit_id];
          const isThreat = !!alert;
          const isTracked = unit.unit_id === trackedUnitId;
          const isPrimary = unit.unit_id === primaryUnitId;
          const color = getMarkerColor(unit.unit_type, alert?.threatLevel);

          return (
            <Marker
              key={unit.unit_id}
              position={[unit.lat, unit.lng]}
              icon={createIcon(unit.unit_type, isThreat, color, isTracked, isPrimary)}
              eventHandlers={{
                click: () => onSelectTarget && onSelectTarget(unit)
              }}
            >
              <Popup>
                <div style={{
                  backgroundColor: '#0d1f2d',
                  color: '#e0f4ff',
                  padding: '10px',
                  fontFamily: 'Courier New',
                  fontSize: '0.72rem',
                  minWidth: '190px',
                  borderRadius: '4px'
                }}>
                  <div style={{
                    color: '#00d4ff',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                    borderBottom: '1px solid #1a3a5c',
                    paddingBottom: '6px',
                    letterSpacing: '2px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{unit.unit_id}</span>
                    {isPrimary && (
                      <span style={{
                        color: '#ff2222',
                        fontSize: '0.6rem',
                        border: '1px solid #ff2222',
                        padding: '1px 4px',
                        borderRadius: '2px'
                      }}>
                        PRIMARY
                      </span>
                    )}
                  </div>

                  {[
                    ['TYPE', unit.unit_type],
                    ['LAT', unit.lat.toFixed(4)],
                    ['LNG', unit.lng.toFixed(4)],
                    ['SPEED', unit.speed + ' kmh'],
                    ['ALT', unit.altitude + ' m'],
                    ['HDG', (unit.heading || 0).toFixed(1) + '°']
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      gap: '12px'
                    }}>
                      <span style={{ color: '#4a7fa5' }}>{label}</span>
                      <span style={{ color: '#e0f4ff' }}>{value}</span>
                    </div>
                  ))}

                  {alert && (
                    <div style={{
                      marginTop: '8px',
                      padding: '6px',
                      backgroundColor: 'rgba(255,34,34,0.1)',
                      borderRadius: '3px',
                      border: '1px solid ' + color
                    }}>
                      <div style={{
                        color: color,
                        fontWeight: 'bold',
                        fontSize: '0.68rem',
                        marginBottom: '3px'
                      }}>
                        {alert.threatLevel} THREAT
                      </div>
                      <div style={{ color: '#aaccdd', fontSize: '0.65rem' }}>
                        {alert.threatType}
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginTop: '8px'
                  }}>
                    <button
                      onClick={() => onSelectTarget && onSelectTarget(unit)}
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,212,255,0.15)',
                        border: '1px solid #00d4ff',
                        color: '#00d4ff',
                        padding: '4px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontFamily: 'Courier New',
                        fontSize: '0.6rem'
                      }}
                    >
                      TRACK
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default TacticalMap;