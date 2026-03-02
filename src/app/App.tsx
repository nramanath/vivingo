import vivingoLogo from '../assets/vivingo-logo.png';

function App() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img src={vivingoLogo} alt="Vivingo" style={{ height: '200px', marginBottom: '20px' }} />
      <h1 style={{ color: '#000000', fontFamily: 'sans-serif' }}>Coming Soon!</h1>
    </div>
  );
}

export default App;
