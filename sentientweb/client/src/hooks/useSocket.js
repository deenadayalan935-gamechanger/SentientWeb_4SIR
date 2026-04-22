import { useEffect, useState } from 'react';
import socket from '../services/socket.js';

const useSocket = () => {
  const [telemetry, setTelemetry] = useState([]);
  const [connected, setConnected] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [redAlert, setRedAlert] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('telemetry_inbound', (data) => {
      setTelemetry((prev) => [data, ...prev].slice(0, 20));
    });

    socket.on('THREAT_CONFIRMED', (alert) => {
      console.log('THREAT CONFIRMED:', alert);
      setAlerts((prev) => [alert, ...prev].slice(0, 10));

      if (alert.threatLevel === 'HIGH' || alert.threatLevel === 'CRITICAL') {
        setRedAlert(true);
        setTimeout(() => setRedAlert(false), 5000);
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('telemetry_inbound');
      socket.off('THREAT_CONFIRMED');
    };
  }, []);

  return { telemetry, connected, alerts, redAlert };
};

export default useSocket;