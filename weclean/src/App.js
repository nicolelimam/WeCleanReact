import { useState } from 'react'
import './App.css'
import Routes from './routes/routes-index'
import ReactDOM from 'react-dom/client';

function App() {

  const observerErrorHandler = () => {
    // Suprime apenas o erro "ResizeObserver loop limit exceeded"
    if (arguments[0].message && arguments[0].message.includes('ResizeObserver')) {
      return;
    }
    // Caso contrário, exibe normalmente no console
    console.error(...arguments);
  };
  
  window.addEventListener('error', observerErrorHandler);
  window.addEventListener('unhandledrejection', observerErrorHandler);
  

  return (
   <div className="App">
      <Routes />
   </div>
  )
}

export default App;
