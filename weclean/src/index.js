import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suprimir erros do ResizeObserver
if (typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined') {
  const resizeObserverErrorHandler = (e) => {
    if (e.message !== 'ResizeObserver loop limit exceeded') {
      console.error(e);
    }
  };

  window.addEventListener('error', resizeObserverErrorHandler);
}

// Renderizar a aplicação
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();