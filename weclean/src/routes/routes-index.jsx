import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login/login";
import Cadastro from "../pages/Cadastro/cadastro";
import Index from "../pages/Index";
import HomeAdministrador from "../pages/Administrador/HomeAdministrador/home-adm";
import FormularioFaxina from "../pages/Cliente/FormFaxina/form-faxina";
import FormularioLavanderia from "../pages/Cliente/FormLavanderia/form-lavanderia";
import FormularioCozinha from "../pages/Cliente/FormCozinha/form-cozinha";
import FormularioJardinagem from "../pages/Cliente/FormJardinagem/form-jardinagem";
import FormularioEndereco from "../pages/Cliente/FormEndereco/form-endereco";
import CadastroFuncionario from "../pages/Administrador/CadastroFuncionario/cadastro-funcionario";
import ListaServicos from "../pages/Administrador/Servicos/lista-servicos";
import ListaFinanceiro from "../pages/Administrador/Financeiro/lista-financeiro";
import RedefinirSenha from "../pages/RedefSenha/redefinir-senha";
import HomeFuncionario from "../pages/Funcionario/home-funcionario";
import HomeCliente from "../pages/Cliente/HomeCliente/home-cliente";
import ListaServicosCliente from "../pages/Cliente/ListaServicos/lista-servicos-cliente";
import PrivateRoute from "../components/PrivateRoute/private-route";

function RoutesIndex() {
  return (
    <Router>
      <Routes>
        {/* rotas publicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Index />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="*" element={<Navigate to="/" />} />

        {/* rotas privadas */}
        <Route
          path="/home-adm"
          element={
            <PrivateRoute>
              <HomeAdministrador />
            </PrivateRoute>
          }
        />
        <Route
          path="/form-faxina"
          element={
            <PrivateRoute>
              <FormularioFaxina />{" "}
            </PrivateRoute>
          }
        />
        <Route
          path="/form-lavanderia"
          element={
            <PrivateRoute>
              <FormularioLavanderia />
            </PrivateRoute>
          }
        />
        <Route
          path="/form-cozinha"
          element={
            <PrivateRoute>
              <FormularioCozinha />
            </PrivateRoute>
          }
        />
        <Route
          path="/form-jardinagem"
          element={
            <PrivateRoute>
              <FormularioJardinagem />
            </PrivateRoute>
          }
        />
        <Route
          path="/form-endereco"
          element={
            <PrivateRoute>
              <FormularioEndereco />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastro-funcionario"
          element={
            <PrivateRoute>
              <CadastroFuncionario />
            </PrivateRoute>
          }
        />
        <Route
          path="/lista-servicos"
          element={
            <PrivateRoute>
              <ListaServicos />
            </PrivateRoute>
          }
        />
        <Route
          path="/lista-financeiro"
          element={
            <PrivateRoute>
              <ListaFinanceiro />
            </PrivateRoute>
          }
        />
        <Route
          path="/home-funcionario"
          element={
            <PrivateRoute>
              <HomeFuncionario />
            </PrivateRoute>
          }
        />
        <Route
          path="/home-cliente"
          element={
            <PrivateRoute>
              <HomeCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/lista-servicos-cliente"
          element={
            <PrivateRoute>
              <ListaServicosCliente />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default RoutesIndex;
