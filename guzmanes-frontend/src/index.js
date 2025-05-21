// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de que este sea el nombre de tu archivo CSS principal (o './styles.css' si lo renombraste)
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();