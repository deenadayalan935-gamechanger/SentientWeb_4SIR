const THRESHOLDS = {
  speed: 800,
  altitude: 9000,
  suspiciousTypes: ['MISSILE']
};

function classifyThreat(telemetry, anomalies) {
  const { speed, altitude, unit_type } = telemetry;

  if (unit_type === 'MISSILE' && speed > 800) {
    return {
      threatLevel: 'CRITICAL',
      threatType: 'Supersonic object detected',
      recommendation: 'Immediate attention required — Scramble intercept units',
      confidence: 95
    };
  }

  if (unit_type === 'MISSILE') {
    return {
      threatLevel: 'HIGH',
      threatType: 'Missile trajectory detected',
      recommendation: 'Track and prepare countermeasures',
      confidence: 88
    };
  }

  if ((unit_type === 'DRONE' || unit_type === 'UAV') && speed > 600) {
    return {
      threatLevel: 'HIGH',
      threatType: 'High-speed UAV anomaly detected',
      recommendation: 'Recommend immediate surveillance and intercept',
      confidence: 82
    };
  }

  if (unit_type === 'DRONE' || unit_type === 'UAV') {
    return {
      threatLevel: 'MEDIUM',
      threatType: 'Possible UAV threat detected',
      recommendation: 'Recommend surveillance — monitor closely',
      confidence: 70
    };
  }

  if (speed > 800) {
    return {
      threatLevel: 'HIGH',
      threatType: 'High-speed anomaly detected',
      recommendation: 'Identify and track — possible hostile aircraft',
      confidence: 78
    };
  }

  if (altitude > 9000) {
    return {
      threatLevel: 'MEDIUM',
      threatType: 'High altitude intrusion detected',
      recommendation: 'Monitor flight path — escalate if heading changes',
      confidence: 65
    };
  }

  return {
    threatLevel: 'LOW',
    threatType: 'Anomalous flight pattern',
    recommendation: 'Log and continue monitoring',
    confidence: 55
  };
}

function runAgentAlpha(telemetry) {
  const anomalies = [];

  if (telemetry.speed > THRESHOLDS.speed) {
    anomalies.push('HIGH SPEED: ' + telemetry.speed + ' kmh');
  }
  if (telemetry.altitude > THRESHOLDS.altitude) {
    anomalies.push('HIGH ALTITUDE: ' + telemetry.altitude + ' m');
  }
  if (THRESHOLDS.suspiciousTypes.includes(telemetry.unit_type)) {
    anomalies.push('SUSPICIOUS TYPE: ' + telemetry.unit_type);
  }

  const isThreat = anomalies.length > 0;
  const classification = isThreat ? classifyThreat(telemetry, anomalies) : null;

  return {
    agent: 'ALPHA',
    isThreat,
    anomalies,
    classification,
    telemetry
  };
}

export default runAgentAlpha;