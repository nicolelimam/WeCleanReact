import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Pagination,
} from "@mui/material";
import MenuAdm from "../../../components/MenuAdm/menu-adm";
import "./lista-financeiro.css";

function ListaFinanceiro() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [page, setPage] = useState(1);
  const paymentsPerPage = 10;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
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

  const tiposServicos = ["Faxina", "Lavanderia", "Jardinagem", "Cozinha"];
  const entradaPagamentos = [
    {
      id: 1,
      numeroServico: 1234,
      cliente: "João",
      funcionario: "Carlos",
      data: "2024-01-01",
      tipo: "Faxina",
      valor: 100.0,
    },
  ];
  const saidaPagamentos = [
    {
      id: 1,
      numeroServico: 5678,
      cliente: "Maria",
      funcionario: "Patrícia",
      data: "2024-01-02",
      tipo: "Lavanderia",
      valor: 80.0,
    },
  ];

  const getFilteredPayments = (pagamentos) =>
    pagamentos
      .filter(
        (pagamento) =>
          pagamento.numeroServico.toString().includes(searchTerm) ||
          pagamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pagamento.funcionario.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((pagamento) =>
        selectedDate ? pagamento.data === selectedDate : true
      )
      .filter((pagamento) =>
        serviceType ? pagamento.tipo === serviceType : true
      );

  const pagamentosExibidos = getFilteredPayments(
    activeTab === 0 ? entradaPagamentos : saidaPagamentos
  ).slice((page - 1) * paymentsPerPage, page * paymentsPerPage);

  return (
    <div className="lista-financeiro-container">
      <MenuAdm activePage="financeiro" />
      <div className="lf-content">
        <div className="lf-main">
          <div className="lf-main-top">
            <h2>Entrada e Saída de Pagamentos</h2>
            <br />
            <Box
              display="flex"
              gap={2}
              className="lf-top-filters"
              alignItems="center"
              mt={2}
            >
              <TextField
                label="Busca por número de serviço, cliente ou funcionário"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ width: "30%" }}
              />
              <TextField
                label="Data de Pagamento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={handleDateChange}
                sx={{ width: "20%" }}
              />
              <FormControl sx={{ width: "20%" }}>
                <InputLabel>Tipo de Serviço</InputLabel>
                <Select
                  value={serviceType}
                  onChange={handleServiceTypeChange}
                  label="Tipo de Serviço"
                >
                  <MenuItem value="">
                    <em>Todos</em>
                  </MenuItem>
                  {tiposServicos.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>

          <div className="lf-main-content">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                "& .MuiTab-root": { color: "var(--corPrincipal)" },
                "& .Mui-selected": {
                  color: "var(--corPrincipal)",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--corPrincipal)",
                },
              }}
            >
              <Tab label="Entrada" />
              <Tab label="Saída/Estornos" />
            </Tabs>

            <Box
              className="pagamentos-lista"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
              }}
            >
              {pagamentosExibidos.length > 0 ? (
                pagamentosExibidos.map((pagamento) => (
                  <Card
                    key={pagamento.id}
                    sx={{ width: "80%", mb: 2 }}
                    className="lf-card"
                  >
                    <CardContent>
                      <Typography variant="h6">
                        Serviço #{pagamento.numeroServico}
                      </Typography>
                      <Typography>Tipo: {pagamento.tipo}</Typography>
                      <Typography>Cliente: {pagamento.cliente}</Typography>
                      <Typography>
                        Funcionário: {pagamento.funcionario}
                      </Typography>
                      <Typography>
                        Data do Pagamento: {pagamento.data}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        Valor: R$ {pagamento.valor.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  Nenhum registro corresponde à sua busca :(
                </Typography>
              )}
            </Box>

            <Pagination
              count={Math.ceil(
                getFilteredPayments(
                  activeTab === 0 ? entradaPagamentos : saidaPagamentos
                ).length / paymentsPerPage
              )}
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

export default ListaFinanceiro;
