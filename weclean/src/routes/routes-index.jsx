import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/login';
import Cadastro from '../pages/Cadastro/cadastro';
import Index from '../pages/Index';

function RoutesIndex() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />}/>
        <Route path='/' element={<Index />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default RoutesIndex;
