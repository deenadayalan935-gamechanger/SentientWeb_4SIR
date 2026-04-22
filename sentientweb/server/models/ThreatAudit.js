import mongoose from 'mongoose';

const threatAuditSchema = new mongoose.Schema({
  unit_id: { type: String, required: true },
  unit_type: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  speed: { type: Number },
  altitude: { type: Number },
  anomalies: [{ type: String }],
  threatLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  threatType: { type: String },
  recommendation: { type: String },
  confidence: { type: Number },
  source: { type: String, default: 'MULTI-AGENT-SYSTEM' }
}, { timestamps: true });

export default mongoose.model('ThreatAudit', threatAuditSchema);