import './App.css'
import P5Sketch from './components/P5Sketch.tsx';

function App() {
  return (
    <div>
      <h1>Capillary Action Simulator</h1>
      <p>Using P5.js canvas and using React.js</p>
      <div className='sketch'>
        <P5Sketch />
      </div>
      <p></p>
    </div>
  );
}

export default App
