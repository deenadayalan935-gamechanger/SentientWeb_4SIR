import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runAgentBeta(alphaResult) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are a military threat analysis AI for a C4ISR system.
Analyze this telemetry data and anomalies detected:

Unit ID: ${alphaResult.telemetry.unit_id}
Unit Type: ${alphaResult.telemetry.unit_type}
Speed: ${alphaResult.telemetry.speed} kmh
Altitude: ${alphaResult.telemetry.altitude} m
Location: LAT ${alphaResult.telemetry.lat}, LNG ${alphaResult.telemetry.lng}
Anomalies Detected: ${alphaResult.anomalies.join(', ')}

Respond in this exact JSON format only, no extra text:
{
  "threatLevel": "LOW" or "MEDIUM" or "HIGH" or "CRITICAL",
  "threatType": "one short phrase",
  "recommendation": "one short action sentence",
  "confidence": a number between 0 and 100
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const clean = text.replace(/json|/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      agent: 'BETA',
      ...parsed
    };

  } catch (error) {
    console.error('Agent Beta error: ' + error.message);
    return {
      agent: 'BETA',
      threatLevel: 'MEDIUM',
      threatType: 'Analysis Unavailable',
      recommendation: 'Manual review required',
      confidence: 0
    };
  }
}

export default runAgentBeta;