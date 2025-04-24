import './App.css'
import P5Sketch from './components/P5Sketch.tsx';

function App() {
  return (
      <div className='sketch'>
        <h1>Capillary Action Simulator</h1>
        <p>Using P5.js</p>
        <P5Sketch />
      </div>
   );
}

export default App
