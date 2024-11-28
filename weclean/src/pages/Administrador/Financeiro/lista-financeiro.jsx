import React, { useState, useEffect } from "react";
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
import { Modal } from "bootstrap";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../backend/firebase";

function ListaFinanceiro() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const paymentsPerPage = 7;


  // Função para buscar os dados do Firestore
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "servicos"));
        const fetchedPayments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPayments(fetchedPayments);
      } catch (error) {
        console.error("Erro ao buscar pagamentos: ", error);
      }
    };

    fetchPayments();
  }, []);

  const handleOpenModal = (pagamento) => {
    setSelectedPayment(pagamento);
    setOpenModal(true);
  };

  const handleConfirmarPagamento = async (id) => {
    try {
      const paymentDoc = doc(db, "servicos", id);
      await updateDoc(paymentDoc, { pagamento_status: "finalizado" });
      setPayments((prevPayments) =>
        prevPayments.map((pagamento) =>
          pagamento.id === id
            ? { ...pagamento, pagamento_status: "finalizado" }
            : pagamento
        )
      );
      setOpenModal(false);
    } catch (error) {
      console.error("Erro ao confirmar pagamento: ", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPayment(null);
  };

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

  const getFilteredPayments = () => {
    const filteredPayments = payments
      .filter((pagamento) =>
        activeTab === 0
          ? pagamento.pagamento_status === "pendente"
          : activeTab === 1
          ? pagamento.pagamento_status === "cancelado"
          : pagamento.pagamento_status === "finalizado"
      )
      .filter(
        (pagamento) =>
          pagamento.modalidade_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pagamento.cliente_id.includes(searchTerm)
      )
      .filter((pagamento) =>
        selectedDate ? pagamento.data_realizacao === selectedDate : true
      )
      .filter((pagamento) =>
        serviceType ? pagamento.modalidade_servico === serviceType : true
      );
    return filteredPayments;
  };
  

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
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Entrada" />
              <Tab label="Saída/Estornos" />
              <Tab label="Histórico" />
            </Tabs>

            <Box className="pagamentos-lista" sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
              {getFilteredPayments()
                .slice((page - 1) * paymentsPerPage, page * paymentsPerPage)
                .map((pagamento) => (
                  <Card key={pagamento.id} sx={{ width: "80%", mb: 2 }} className="lf-card">
                    <CardContent className="lf-card-content">
                      <div className="lf-card-info-dif">
                        <Typography variant="h6" style={{color: "var(--corPrincipal)", fontWeight: 700}}>Serviço - {pagamento.modalidade_servico}</Typography>
                        <Typography>Cliente ID: {pagamento.cliente_id}</Typography>
                        <Typography>Valor: R$ {parseFloat(pagamento.valor).toFixed(2)}</Typography>
                        <Typography>Status do Pagamento: {pagamento.pagamento_status}</Typography>
                      </div>
                      <div className="lf-card-btn-div">
                        {pagamento.pagamento_status === "pendente" && (
                          <button
                            onClick={() => handleConfirmarPagamento(pagamento.id)}
                            style={{ backgroundColor: "green", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
                          >
                            Confirmar pagamento
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </Box>

            <Pagination
              count={Math.ceil(getFilteredPayments().length / paymentsPerPage)}
              page={page}
              onChange={handlePageChange}
              sx={{ mt: 3 }}
            />
          </div>
        </div>
      </div>

      {selectedPayment && (
  <Modal open={openModal} onClose={handleCloseModal}>
    <div style={{ padding: "20px", background: "white", borderRadius: "10px" }}>
      <Typography variant="h6">Detalhes do Serviço</Typography>
      <Typography>Cliente: {selectedPayment.cliente}</Typography>
      <Typography>Modalidade: {selectedPayment.tipo}</Typography>
      <Typography>Valor: R$ {selectedPayment.valor.toFixed(2)}</Typography>
      <Typography>Status do Pagamento: {selectedPayment.pagamento_status}</Typography>
      <Typography>Pagamento: {selectedPayment.pagamento}</Typography>
      <Typography>Tipo de Pagamento: {selectedPayment.pagamento_tipo}</Typography>
      <Typography>Data da Realização: {selectedPayment.data_realizacao}</Typography>
      {selectedPayment.pagamento_status === "pendente" && (
        <button
          onClick={() => handleConfirmarPagamento(selectedPayment.id)}
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Confirmar pagamento
        </button>
      )}
    </div>
  </Modal>
)}

    </div>
  );
}

export default ListaFinanceiro;
