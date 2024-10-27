import React, { useState, useEffect } from "react";
import MenuSidebarAdministrador from "../../../components/AdmMenuSidebar/adm-menu-sidebar";
import { Tabs, Tab, Box, Card, CardContent, Typography, Pagination, Tooltip, Menu, MenuItem, TextField, Select, InputLabel, FormControl } from "@mui/material";
import './lista-servicos.css';
import MenuAdm from "../../../components/MenuAdm/menu-adm";

function ListaServicos() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const servicesPerPage = 12;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
  };

  // Gerando serviços aleatórios
  const tiposServicos = ["Faxina", "Lavanderia", "Jardinagem", "Cozinha"];
  const nomesClientes = ["João", "Maria", "Lucas", "Ana", "Pedro"];
  const nomesFuncionarios = ["Carlos", "Patrícia", "Fernanda", "Roberto", "Bruna"];

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

  const servicosPendentes = gerarServicos(45); 
  const servicosFinalizados = gerarServicos(30);
  const servicosCancelados = gerarServicos(20);
  const servicosAnalise = gerarServicos(10);

  

  const filteredServicos = getServicos()
  .filter((servico) =>
    servico.id.toString().includes(searchTerm) ||
    servico.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.funcionario.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((servico) => 
    selectedDate ? servico.data === selectedDate : true
  )
  .filter((servico) => 
    serviceType ? servico.tipo === serviceType : true
  );


  

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


  const servicosExibidos = filteredServicos.slice(
    (page - 1) * servicesPerPage,
    page * servicesPerPage
  );
  

  return (
    <div className="lista-servicos-container">
      
      <MenuAdm activePage='servicos' />
      <div className="ls-content">
      

        <div className="ls-main">
            <div className="ls-main-top">
                <h2>Serviços e Solicitações</h2>
                <br />
                <Box display="flex" gap={2} alignItems="center" className="ls-top-filters">
              <TextField
                label="Busca por número de serviço, cliente ou funcionário"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: '30%' }}
              />
              <TextField
                label="Data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: '20%' }}
              />
              <FormControl sx={{ width: '20%' }}>
                <InputLabel>Tipo de Serviço</InputLabel>
                <Select
                  value={serviceType}
                  onChange={handleServiceTypeChange}
                  label="Tipo de Serviço"
                >
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  <MenuItem value="Faxina">Faxina</MenuItem>
                  <MenuItem value="Lavanderia">Lavanderia</MenuItem>
                  <MenuItem value="Jardinagem">Jardinagem</MenuItem>
                  <MenuItem value="Cozinha">Cozinha</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
              {servicosExibidos.length > 0 ? (
                servicosExibidos.map((servico) => (
                  <Card key={servico.id} sx={{ width: "80%", mb: 2 }} className="ls-card">
                    <CardContent>
                      <Typography variant="h6">Serviço #{servico.id}</Typography>
                      <Typography>Tipo: {servico.tipo}</Typography>
                      <Typography>Cliente: {servico.cliente}</Typography>
                      <Typography>Funcionário: {servico.funcionario}</Typography>
                      <Typography>Data Agendada: {servico.data}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                  Nenhum serviço corresponde à sua busca :(
                </Typography>
              )}
            </Box>


            <Pagination
            count={Math.ceil(filteredServicos.length / servicesPerPage)}
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
