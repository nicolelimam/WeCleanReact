import { useState } from 'react'
import './App.css'
import Routes from './routes/routes-index'
import ReactDOM from 'react-dom/client';

function App() {

  if (typeof window !== "undefined") {
    const resizeObserverErrFix = () => {
      const resizeObserverError = (e) => {
        if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
          e.stopImmediatePropagation();
        }
      };
      window.addEventListener('error', resizeObserverError);
      return () => window.removeEventListener('error', resizeObserverError);
    };
    resizeObserverErrFix();
  }

  return (
   <div className="App">
      <Routes />
   </div>
  )
}

export default App;
