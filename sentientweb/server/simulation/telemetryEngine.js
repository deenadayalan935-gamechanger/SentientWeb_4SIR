import { processThreatPipeline } from '../socket/socketHandler.js';

const LAT_MIN = 8.0;
const LAT_MAX = 37.0;
const LNG_MIN = 68.0;
const LNG_MAX = 97.0;

const UNIT_TYPES = ['DRONE', 'RADAR', 'UAV', 'MISSILE', 'AIRCRAFT'];
const UNIT_IDS = ['ALPHA-1', 'BETA-2', 'GAMMA-3', 'DELTA-4', 'ECHO-5'];

function randomBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(6));
}

function generateTelemetry() {
  return {
    unit_id: UNIT_IDS[Math.floor(Math.random() * UNIT_IDS.length)],
    unit_type: UNIT_TYPES[Math.floor(Math.random() * UNIT_TYPES.length)],
    lat: randomBetween(LAT_MIN, LAT_MAX),
    lng: randomBetween(LNG_MIN, LNG_MAX),
    speed: parseFloat((Math.random() * 900 + 100).toFixed(2)),
    altitude: parseFloat((Math.random() * 10000 + 500).toFixed(2)),
    heading: parseFloat((Math.random() * 360).toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

function startSimulation(io) {
  console.log('Telemetry simulation started');

  setInterval(() => {
    const telemetry = generateTelemetry();

    io.emit('telemetry_inbound', telemetry);
    console.log('Telemetry sent: ' + telemetry.unit_id + ' at ' + telemetry.lat + ', ' + telemetry.lng);

    processThreatPipeline(io, telemetry);

  }, 3000);
}

export default startSimulation;