import runAgentAlpha from '../agents/agentAlpha.js';
import runAgentBeta from '../agents/agentBeta.js';
import runAgentGamma from '../agents/agentGamma.js';
import ThreatAudit from '../models/ThreatAudit.js';

export function initSocketHandler(io) {
  io.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected: ' + socket.id);
    });
  });
}

export async function processThreatPipeline(io, telemetry) {
  try {
    const alphaResult = runAgentAlpha(telemetry);

    if (!alphaResult.isThreat) return;

    console.log('Agent Alpha flagged threat: ' + telemetry.unit_id);

    const betaResult = await runAgentBeta(alphaResult);
    console.log('Agent Beta analysis: ' + betaResult.threatLevel);

    const gammaResult = runAgentGamma(alphaResult, betaResult);
    console.log('Agent Gamma alert ready: ' + gammaResult.alert.threatType);

    io.emit('THREAT_CONFIRMED', gammaResult.alert);

    const threat = new ThreatAudit({
      unit_id: gammaResult.alert.unit_id,
      unit_type: gammaResult.alert.unit_type,
      lat: gammaResult.alert.lat,
      lng: gammaResult.alert.lng,
      speed: gammaResult.alert.speed,
      altitude: gammaResult.alert.altitude,
      anomalies: gammaResult.alert.anomalies,
      threatLevel: gammaResult.alert.threatLevel,
      threatType: gammaResult.alert.threatType,
      recommendation: gammaResult.alert.recommendation,
      confidence: gammaResult.alert.confidence,
      source: gammaResult.alert.source
    });

    await threat.save();
    console.log('Threat saved to database: ' + threat.unit_id);

  } catch (error) {
    console.error('Pipeline error: ' + error.message);
  }
}