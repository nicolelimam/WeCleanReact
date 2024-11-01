import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/login';
import Cadastro from '../pages/Cadastro/cadastro';
import Index from '../pages/Index';
import HomeAdministrador from '../pages/Administrador/HomeAdministrador/home-adm';
import FormularioFaxina from '../pages/Cliente/FormFaxina/form-faxina';
import FormularioLavanderia from '../pages/Cliente/FormLavanderia/form-lavanderia';
import FormularioCozinha from '../pages/Cliente/FormCozinha/form-cozinha';
import FormularioJardinagem from '../pages/Cliente/FormJardinagem/form-jardinagem';
import FormularioEndereco from '../pages/Cliente/FormEndereco/form-endereco';
import CadastroFuncionario from '../pages/Administrador/CadastroFuncionario/cadastro-funcionario';
import ListaServicos from '../pages/Administrador/Servicos/lista-servicos';
import ListaFinanceiro from '../pages/Administrador/Financeiro/lista-financeiro';
import RedefinirSenha from '../pages/RedefSenha/redefinir-senha';
import HomeFuncionario from '../pages/Funcionario/home-funcionario';
import HomeCliente from '../pages/Cliente/HomeCliente/home-cliente';

function RoutesIndex() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/cadastro' element={<Cadastro />}/>
        <Route path='/' element={<Index />} />
        <Route path='/home-adm' element={<HomeAdministrador />} />
        <Route path='/form-faxina' element={<FormularioFaxina />} />
        <Route path='/form-lavanderia' element={<FormularioLavanderia />} />
        <Route path='/form-cozinha' element={<FormularioCozinha />} />
        <Route path='/form-jardinagem' element={<FormularioJardinagem />} />
        <Route path='/form-endereco' element={<FormularioEndereco />} />
        <Route path='/cadastro-funcionario' element={<CadastroFuncionario />} />
        <Route path='/lista-servicos' element={<ListaServicos />} />
        <Route path='/lista-financeiro' element={<ListaFinanceiro />} />
        <Route path='/home-funcionario' element={<HomeFuncionario />} />
        <Route path='/home-cliente' element={<HomeCliente/>} />
        <Route path='/redefinir-senha' element={<RedefinirSenha />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default RoutesIndex;
