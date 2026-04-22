import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const getMarkerColor = (unitType, threatLevel) => {
  if (threatLevel === 'CRITICAL') return '#ff2222';
  if (threatLevel === 'HIGH') return '#ff6600';
  if (unitType === 'MISSILE') return '#ff2222';
  if (unitType === 'DRONE' || unitType === 'UAV') return '#ffaa00';
  if (unitType === 'AIRCRAFT') return '#aa44ff';
  if (unitType === 'RADAR') return '#00d4ff';
  return '#00ff88';
};

const createIcon = (unitType, isThreaten) => {
  const color = getMarkerColor(unitType);
  const size = isThreaten ? 14 : 10;

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative; width:${size}px; height:${size}px;">
        ${isThreaten ? `
        <div style="
          position:absolute;
          top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:${size * 2.5}px;
          height:${size * 2.5}px;
          border-radius:50%;
          border: 1.5px solid ${color};
          animation: pulseRing 1.2s ease-out infinite;
          opacity:0.6;
        "></div>` : ''}
        <div style="
          width:${size}px;
          height:${size}px;
          background:${color};
          border:2px solid #ffffff;
          border-radius:50%;
          box-shadow: 0 0 ${isThreaten ? 12 : 6}px ${color};
          position:relative;
          z-index:2;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

function TacticalMap({ telemetry, alerts }) {
  const latestByUnit = {};
  telemetry.forEach((t) => {
    latestByUnit[t.unit_id] = t;
  });

  const threatUnitIds = new Set(alerts.map(a => a.unit_id));
  const units = Object.values(latestByUnit);

  const getAlertForUnit = (unit_id) => {
    return alerts.find(a => a.unit_id === unit_id);
  };

  return (
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

      {units.map((unit) => {
        const isThreat = threatUnitIds.has(unit.unit_id);
        const alert = getAlertForUnit(unit.unit_id);
        const color = getMarkerColor(unit.unit_type, alert?.threatLevel);

        return (
          <Marker
            key={unit.unit_id}
            position={[unit.lat, unit.lng]}
            icon={createIcon(unit.unit_type, isThreat)}
          >
            <Popup>
              <div style={{
                backgroundColor: '#0d1f2d',
                color: '#e0f4ff',
                padding: '8px',
                fontFamily: 'Courier New',
                fontSize: '0.75rem',
                minWidth: '160px'
              }}>
                <div style={{
                  color: '#00d4ff',
                  fontWeight: 'bold',
                  marginBottom: '6px',
                  fontSize: '0.85rem'
                }}>
                  {unit.unit_id}
                </div>
                <div style={{ color: '#4a7fa5', marginBottom: '4px' }}>
                  TYPE: <span style={{ color: '#e0f4ff' }}>{unit.unit_type}</span>
                </div>
                <div style={{ color: '#4a7fa5', marginBottom: '4px' }}>
                  LAT: <span style={{ color: '#e0f4ff' }}>{unit.lat.toFixed(4)}</span>
                </div>
                <div style={{ color: '#4a7fa5', marginBottom: '4px' }}>
                  LNG: <span style={{ color: '#e0f4ff' }}>{unit.lng.toFixed(4)}</span>
                </div>
                <div style={{ color: '#4a7fa5', marginBottom: '4px' }}>
                  SPD: <span style={{ color: '#e0f4ff' }}>{unit.speed} kmh</span>
                </div>
                <div style={{ color: '#4a7fa5', marginBottom: '4px' }}>
                  ALT: <span style={{ color: '#e0f4ff' }}>{unit.altitude} m</span>
                </div>
                {alert && (
                  <div style={{
                    marginTop: '6px',
                    padding: '4px',
                    backgroundColor: '#1a0000',
                    borderRadius: '3px',
                    color: '#ff6600'
                  }}>
                    ⚠ {alert.threatType}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default TacticalMap;