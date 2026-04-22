function runAgentGamma(alphaResult, betaResult) {
  const classification = alphaResult.classification || {};

  const threatLevel = betaResult.threatLevel !== 'MEDIUM' || betaResult.confidence > 0
    ? betaResult.threatLevel
    : classification.threatLevel || 'MEDIUM';

  const threatType = betaResult.threatType !== 'Analysis Unavailable'
    ? betaResult.threatType
    : classification.threatType || 'Anomalous activity detected';

  const recommendation = betaResult.recommendation !== 'Manual review required'
    ? betaResult.recommendation
    : classification.recommendation || 'Monitor and log';

  const confidence = betaResult.confidence > 0
    ? betaResult.confidence
    : classification.confidence || 60;

  const alert = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    unit_id: alphaResult.telemetry.unit_id,
    unit_type: alphaResult.telemetry.unit_type,
    lat: alphaResult.telemetry.lat,
    lng: alphaResult.telemetry.lng,
    speed: alphaResult.telemetry.speed,
    altitude: alphaResult.telemetry.altitude,
    heading: alphaResult.telemetry.heading,
    anomalies: alphaResult.anomalies,
    threatLevel,
    threatType,
    recommendation,
    confidence,
    source: 'MULTI-AGENT-SYSTEM'
  };

  return { agent: 'GAMMA', alert };
}

export default runAgentGamma;