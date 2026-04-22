import { useEffect } from 'react';
import useSocket from './hooks/useSocket.js';
import TacticalMap from './components/Map/TacticalMap.jsx';
import AlertPanel from './components/AlertPanel/AlertPanel.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Dashboard() {
  const { telemetry, connected, alerts, redAlert } = useSocket();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (redAlert) {
      document.body.classList.add('red-alert');
    } else {
      document.body.classList.remove('red-alert');
    }
  }, [redAlert]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: redAlert ? '#1a0000' : '#050a0e',
      fontFamily: 'Courier New, monospace',
      color: '#e0f4ff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'background-color 0.3s'
    }}>

      {/* Header */}
      <div style={{
        backgroundColor: redAlert ? '#2a0000' : '#0a1628',
        borderBottom: '1px solid ' + (redAlert ? '#ff2222' : '#1a3a5c'),
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.3s'
      }}>

        {/* Left — Title */}
        <h1 style={{
          color: redAlert ? '#ff2222' : '#00d4ff',
          fontSize: '1.1rem',
          margin: 0,
          letterSpacing: '2px'
        }}>
          SENTIENTWEB — C4ISR DASHBOARD
          {redAlert && (
            <span style={{
              marginLeft: '12px',
              color: '#ff2222',
              animation: 'pulseBorder 0.5s infinite'
            }}>
              RED ALERT
            </span>
          )}
        </h1>

        {/* Right — Status Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          fontSize: '0.72rem'
        }}>
          <span style={{ color: '#4a7fa5' }}>
            {user.role.toUpperCase()}:
            <span style={{ color: '#00d4ff' }}> {user.username}</span>
          </span>
          <span style={{ color: connected ? '#00ff88' : '#ff2222' }}>
            {connected ? '● CONNECTED' : '● DISCONNECTED'}
          </span>
          <span style={{ color: '#00ff88' }}>● AI ACTIVE</span>
          <span style={{ color: '#00ff88' }}>● DB SYNCED</span>
          <span style={{
            backgroundColor: alerts.length > 0 ? '#ff2222' : '#1a3a5c',
            color: '#fff',
            padding: '2px 10px',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            THREATS: {alerts.length}
          </span>
          <button
            onClick={logout}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #1a3a5c',
              color: '#4a7fa5',
              padding: '3px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'Courier New',
              fontSize: '0.68rem'
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Map Panel */}
        <div style={{ flex: 2, position: 'relative' }}>
          <TacticalMap telemetry={telemetry} alerts={alerts} />
        </div>

        {/* Right Panel */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid ' + (redAlert ? '#ff2222' : '#1a3a5c'),
          overflow: 'hidden'
        }}>

          {/* Alert Panel */}
          <div style={{
            flex: 1.2,
            borderBottom: '1px solid #1a3a5c',
            overflow: 'hidden'
          }}>
            <AlertPanel alerts={alerts} />
          </div>

          {/* Telemetry Feed */}
          <div style={{
            flex: 1,
            backgroundColor: '#080f18',
            overflowY: 'auto',
            padding: '8px'
          }}>
            <div style={{
              padding: '4px 2px 8px 2px',
              borderBottom: '1px solid #1a3a5c',
              marginBottom: '8px',
              color: '#4a7fa5',
              fontSize: '0.72rem'
            }}>
              LIVE TELEMETRY FEED
            </div>

            {telemetry.map((t, index) => (
              <div key={index} style={{
                backgroundColor: '#0d1f2d',
                border: '1px solid #1a3a5c',
                borderRadius: '4px',
                padding: '6px 8px',
                marginBottom: '5px',
                fontSize: '0.68rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '3px'
                }}>
                  <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                    [{t.unit_id}]
                  </span>
                  <span style={{
                    backgroundColor: '#1a3a5c',
                    color: '#00d4ff',
                    padding: '0px 5px',
                    borderRadius: '3px',
                    fontSize: '0.62rem'
                  }}>
                    {t.unit_type}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#4a7fa5'
                }}>
                  <span>{t.lat.toFixed(3)}, {t.lng.toFixed(3)}</span>
                  <span style={{ color: '#aaccdd' }}>SPD: {t.speed}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <LoginPage />;
}

export default App;