import React, { useState, useEffect } from "react";
import MenuSidebarAdministrador from "../../../components/AdmMenuSidebar/adm-menu-sidebar";
import { Tabs, Tab, Box, Card, CardContent, Typography, Pagination, Tooltip, Menu, MenuItem } from "@mui/material";
import './lista-servicos.css';

function ListaServicos() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null); // Definindo anchorEl para o menu de notificações
  const servicesPerPage = 12;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1); // Reseta a página ao trocar de aba
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Gerando serviços aleatórios
  const tiposServicos = ["Faxina", "Lavanderia", "Jardinagem", "Cozinha"];
  const nomesClientes = ["João", "Maria", "Lucas", "Ana", "Pedro"];
  const nomesFuncionarios = ["Carlos", "Patrícia", "Fernanda", "Roberto", "Bruna"];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1299) {
        setShowSidebar(false); // oculta o menu se a largura for <= 1299px
      } else {
        setShowSidebar(true); // exibe o menu se a largura for > 1299px
      }
    };

    window.addEventListener("resize", handleResize);

    // executa o handleResize inicialmente para verificar o tamanho ao carregar a página
    handleResize();

    return () => window.removeEventListener("resize", handleResize); // Limpa o evento quando o componente desmonta
  }, []);

  const gerarServico = () => {
    const tipo = tiposServicos[Math.floor(Math.random() * tiposServicos.length)];
    const cliente = nomesClientes[Math.floor(Math.random() * nomesClientes.length)];
    const funcionario = nomesFuncionarios[Math.floor(Math.random() * nomesFuncionarios.length)];
    const data = new Date().toLocaleDateString();
    return { tipo, cliente, funcionario, data };
  };

  const gerarServicos = (quantidade) => {
    return Array.from({ length: quantidade }, (_, index) => ({
      id: index + 1,
      ...gerarServico(),
    }));
  };

  const servicosPendentes = gerarServicos(45); // Exemplo com 45 serviços
  const servicosFinalizados = gerarServicos(30);
  const servicosCancelados = gerarServicos(20);
  const servicosAnalise = gerarServicos(10);

  const getServicos = () => {
    switch (activeTab) {
      case 0:
        return servicosPendentes;
      case 1:
        return servicosFinalizados;
      case 2:
        return servicosCancelados;
      case 3:
        return servicosAnalise;
      default:
        return [];
    }
  };

  const servicosExibidos = getServicos().slice(
    (page - 1) * servicesPerPage,
    page * servicesPerPage
  );

  return (
    <div className="lista-servicos-container">
      {showSidebar && <MenuSidebarAdministrador />}

      <div className="ls-content">
        <div className="ls-header">
          <div className="ls-header-txt">
            <h5>Olá, Ana!</h5>
          </div>
          <div className="ls-header-btn-group">
            <button
              className="btn-notificacao"
              onClick={handleMenuOpen}
              data-tooltip-id="tooltip-notificacao"
              data-tooltip-content="Notificações"
            >
              <i className="bi bi-bell-fill"></i>
            </button>
            <Tooltip
              id="tooltip-notificacao"
              place="bottom"
              style={{ backgroundColor: "var(--corPrincipal)", color: "#fff" }} // Personalizando o estilo
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <MenuItem onClick={handleMenuClose}>Notificação 1</MenuItem>
              <MenuItem onClick={handleMenuClose}>Notificação 2</MenuItem>
              <MenuItem onClick={handleMenuClose}>Notificação 3</MenuItem>
            </Menu>

            <button
              className="btn-logout"
              data-tooltip-id="tooltip-logout"
              data-tooltip-content="Sair"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>

            <Tooltip
              id="tooltip-logout"
              place="bottom"
              style={{ backgroundColor: "var(--corPrincipal)", color: "#fff" }} // Personalizando o estilo
            />
          </div>
        </div>

        <div className="ls-main">
            <div className="ls-main-top">
                <h2>Serviços e Solicitações</h2>
            </div>
          
          <div className="ls-main-content">
          <Tabs 
            value={activeTab} 
            className="abas-lista" 
            onChange={handleTabChange} 
            centered
            sx={{
                "& .MuiTab-root": {
                color: "var(--corPrincipal)", 
                },
                "& .Mui-selected": {
                color: "var(--corPrincipal)", 
                fontWeight: "bold", 
                },
                "& .MuiTabs-indicator": {
                backgroundColor: "var(--corPrincipal)",
                },
            }}
            >
            <Tab label="Pendentes" />
            <Tab label="Finalizados" />
            <Tab label="Cancelados" />
            <Tab label="Em análise" />
            </Tabs>


          <Box className="servicos-lista" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
            {servicosExibidos.map((servico) => (
              <Card key={servico.id} sx={{ width: "80%", mb: 2 }} className="ls-card">
                <CardContent>
                  <Typography variant="h6">Serviço #{servico.id}</Typography>
                  <Typography>Tipo: {servico.tipo}</Typography>
                  <Typography>Cliente: {servico.cliente}</Typography>
                  <Typography>Funcionário: {servico.funcionario}</Typography>
                  <Typography>Data Agendada: {servico.data}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Pagination
            count={Math.ceil(getServicos().length / servicesPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 3 }}
          />
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default ListaServicos;
